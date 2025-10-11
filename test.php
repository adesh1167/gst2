<?php

    include "../db.php";
    function getFixtureData($fixtureId, $team1Id, $team2Id)
    {
        $cacheTtl = 3600; // 1 hour
        $now = time();

        // 1. Check cache
        $sql = "SELECT data, last_updated FROM fixture_stats_cache WHERE fixture_id = ?";
        $result = fetch($sql, [$fixtureId], "s");
        if ($result && $result->num_rows > 0) {
            $row = $result->fetch_assoc();
            // if (($now - strtotime($row['last_updated'])) < $cacheTtl) {
            return json_decode($row['data'], true);
            // }
        }

        // 2. API calls
        $apiHost = "https://api-football-v1.p.rapidapi.com/v3";
        $headers = [
            "X-RapidAPI-Key: 10e4024c89mshdb5e3e346c997a7p1ce598jsna7f5e5d824ba",
            "X-RapidAPI-Host: api-football-v1.p.rapidapi.com"
        ];

        $season = date('Y');

        $endpoints = [
            "fixture" => "$apiHost/fixtures?id=$fixtureId",
            // "head_to_head" => "$apiHost/fixtures/headtohead?h2h={$team1Id}-{$team2Id}",
            // "players" => "$apiHost/fixtures/players?fixture=$fixtureId",
            "predictions" => "$apiHost/predictions?fixture=$fixtureId",
            "home_form" => "$apiHost/fixtures?team={$team1Id}&last=5",
            "away_form" => "$apiHost/fixtures?team={$team2Id}&last=5",
            "home_team" => "$apiHost/players?team=$team1Id&season=$season",
            "away_team" => "$apiHost/players?team=$team2Id&season=$season",
        ];

        $merged = [];
        foreach ($endpoints as $key => $url) {
            $ch = curl_init();
            curl_setopt_array($ch, [
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_HTTPHEADER => $headers
            ]);
            $response = curl_exec($ch);
            if ($response === false) {
                curl_close($ch);
                throw new Exception("cURL error fetching $key: " . curl_error($ch));
            }
            curl_close($ch);

            $decoded = json_decode($response, true);
            $merged[$key] = $decoded["response"] ?? $decoded;
        }

        $finalJson = json_encode($merged);

        // 3. Save to DB (insert or update)
        // if ($result && $result->num_rows > 0) {
        //     $sql = "UPDATE fixture_stats_cache SET data = ?, last_updated = NOW() WHERE fixture_id = ?";
        //     insert($sql, [$finalJson, $fixtureId], "ss");
        // } else {
        $sql = "INSERT INTO fixture_stats_cache (fixture_id, data, last_updated) VALUES (?, ?, NOW())";
        insert($sql, [$fixtureId, $finalJson], "ss");
        // }

        return $merged;
    }

    session_start();

    $response = [
        "status" => "error",
        "message" => "An unknown error occurred"
    ];

    $data = json_decode(file_get_contents("php://input"), true) ?? $_GET;

    if (isset($_SESSION['id'])) {
        if (isset($data['fixture_id'], $data['team1_id'], $data['team2_id'])) {
            $query = "SELECT (end_date > NOW()) AS active FROM deep_analyzer_subscriptions WHERE user_id = ? ORDER BY end_date DESC LIMIT 1";
            $result = fetch($query, [$_SESSION['id']], 'i');
            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                if ($row['active']) {
                    $response['data'] = getFixtureData($data['fixture_id'], $data['team1_id'], $data['team2_id']);
                    $response['status'] = "success";
                    $response['message'] = "Fixture data successfully fetched";
                } else {
                    $response['message'] = "Your subscription has expired. Please renew your subscription to continue using DEEP ANALYZER.";
                    $response['error_code'] = "SUB_EXPIRED";
                }
            } else {
                $response['message'] = "You need a subscription to use DEEP ANALYZER";
                $response['error_code'] = "NO_SUB";
            }
        } else {
            $response['message'] = "Invalid Request";
        }
    } else {
        $response['message'] = 'You are not logged in';
        $response['error_code'] = 'NOT_LOGGED_IN';
    }

    exit(json_encode($response, JSON_PARTIAL_OUTPUT_ON_ERROR));
?>