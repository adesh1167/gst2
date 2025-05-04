function parseFixtures(data, base = {}){
    
    const countries = data.reduce((acc, fixture) => {
      const rawData = JSON.parse(fixture.match_data);
      const country = rawData.league.country;
      if (!acc[country]) {
        acc[country] = {
            name: country,
            flag: rawData.league.flag,
            leagues: {}
        };
      }
      const league = rawData.league.name;
      if (!acc[country].leagues[league]) {
        acc[country].leagues[league] = {
            name: league,
            logo: rawData.league.logo,
            fixtures: {}
        };
      }
      const fixtureData = rawData.fixture
    //   acc[country].leagues[league].fixtures.push({...fixture, match_data: rawData});
      acc[country].leagues[league].fixtures[fixtureData.id] = ({...fixture, match_data: rawData});
    //   console.log(acc)
      return acc
    }, base)

    return countries;
  }

  export function parsePaidMatch(data){
    const fixtureData = JSON.parse(data.match_data);
    const matchDetails = {
      home: fixtureData.teams.home.name,
      away: fixtureData.teams.away.name,
      date: fixtureData.fixture.date,
      league: fixtureData.league.name,
      country: fixtureData.league.country,
      selection: data.selection,
      gameType: data.game_type,
      odds: data.odds,
      id: data.id,
    }

    return matchDetails
  }

  export default parseFixtures;