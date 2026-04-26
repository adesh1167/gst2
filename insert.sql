INSERT INTO mail_queue(send_to, subject, html_body) SELECT email, "New tool: Deep Analyzer - AI match analysis",
CONCAT('<html lang="en"><head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Introducing DeepAnalyzer</title>
  <style>
    body,table,td,a{ -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    table,td{ mso-table-lspace:0pt; mso-table-rspace:0pt; }
    img{ -ms-interpolation-mode:bicubic; display:block; border:0; outline:none; text-decoration:none; }
    a[x-apple-data-detectors] { color:inherit !important; text-decoration:none !important; }

    body { margin:0; padding:0; width:100% !important; height:100% !important; background-color:#0b0720; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; }

    .email-wrapper { width:100%; background: linear-gradient(180deg, #0b0720 0%, #1a0521 100%); padding:40px 16px; box-sizing:border-box; }
    .email-body { max-width:680px; margin:0 auto; background: #0f0723; border-radius:12px; overflow:hidden; box-shadow: 0 8px 30px rgba(10,6,20,0.6); }

    .header { padding:28px 28px 16px; text-align:center; background: linear-gradient(90deg, rgba(111,0,255,0.06), rgba(255,0,77,0.03)); }
    .brand { display:inline-flex; gap:12px; align-items:center; justify-content:center; }
    .logo-wrap { width:56px; height:56px; border-radius:12px; background: linear-gradient(135deg,#6f00ff,#ff004d); display:flex; align-items:center; justify-content:center; }
    .logo-wrap svg { width:36px; height:36px; filter: drop-shadow(0 4px 12px rgba(111,0,255,0.18)); }

    .preheader { font-size:12px; color:#a89ad6; margin-top:8px; }

    .hero { padding:28px; color:#f3eefc; text-align:left; }
    h1 { margin:0 0 10px 0; font-size:28px; line-height:1.05; color:#ffffff; letter-spacing:-0.2px; }
    p.lead { margin:0 0 18px 0; color:#d7cfe9; font-size:15px; line-height:1.5; }

    .features { padding:0 28px 28px; display:block; }
    .feature-row { display:flex; gap:14px; align-items:flex-start; margin-bottom:12px; }
    .feature-icon { min-width:56px; height:56px; border-radius:10px; background: linear-gradient(180deg,#22083a,#3b0730); display:flex; align-items:center; justify-content:center; box-shadow: inset 0 1px 0 rgba(255,255,255,0.02); }
    .feature-icon svg { width:28px; height:28px; }
    .feature-text h3 { margin:0; font-size:15px; color:#fff; }
    .feature-text p { margin:6px 0 0; font-size:13px; color:#cdbfe6; }

    .cta-wrap { padding:22px 28px 36px; text-align:center; }
    .cta { display:inline-block; padding:14px 22px; border-radius:10px; text-decoration:none; font-weight:600; font-size:15px; color:#1b0015; background: linear-gradient(90deg,#ff2d6d,#7a00ff); box-shadow: 0 8px 24px rgba(122,0,255,0.18); }
    .secondary { display:inline-block; margin-left:12px; padding:12px 18px; border-radius:10px; text-decoration:none; font-size:14px; color:#cdbfe6; border:1px solid rgba(255,255,255,0.03); background:transparent; }

    .footer { padding:20px 28px 28px; color:#9b88c9; font-size:12px; border-top:1px solid rgba(255,255,255,0.02); background: linear-gradient(180deg, rgba(255,255,255,0.01), transparent); }
    .small { font-size:11px; color:#9484be; margin-top:8px; }

    @media screen and (max-width:520px) {
      .feature-row { flex-direction:row; gap:12px; }
      h1 { font-size:22px; }
      .hero { padding:20px; }
      .features, .cta-wrap, .footer, .header { padding-left:20px; padding-right:20px; }
    }
  </style>
</head>
<body>
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
    DeepAnalyzer – AI-powered football prediction that gives you data-backed confidence.
  </div>

  <div class="email-wrapper">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tbody><tr>
        <td align="center">
          <table role="presentation" class="email-body" cellpadding="0" cellspacing="0" width="100%">
            <tbody><tr>
              <td class="header">
                <div class="brand" aria-label="DeepAnalyzer">
                  
                  <div style="text-align:left;">
                    <div style="font-weight:700;color:#fff;font-size: 24px;">DeepAnalyzer</div>
                    <div class="preheader">AI-Powered Football Bet Prediction Tool</div>
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <td class="hero">
                <h1>Introducing DeepAnalyzer — AI that predicts with precision.</h1>
                <p class="lead">
                  Hi <strong>',first_name,' ',last_name,'</strong>,  
                  we’re excited to announce <strong>DeepAnalyzer</strong> — an AI-powered prediction engine designed for serious football enthusiasts and smart bettors.  
                  Using real match data, team form, and advanced pattern recognition, it helps you make confident, data-backed predictions every day.
                </p>
              </td>
            </tr>

            <tr>
              <td class="features">
                <div class="feature-row">
                  
                  <div class="feature-text">
                    <h3>Real-Time AI Predictions</h3>
                    <p>Get accurate match outcomes powered by live stats, player performance, and our adaptive AI model.</p>
                  </div>
                </div>

                <div class="feature-row">
                  
                  <div class="feature-text">
                    <h3>Smart Confidence Ratings</h3>
                    <p>Each prediction includes a confidence score and reasoning — giving you clarity, not just numbers.</p>
                  </div>
                </div>

                <div class="feature-row">
                  
                  <div class="feature-text">
                    <h3>Transparent &amp; Reliable</h3>
                    <p>No hidden algorithms — see exactly how the AI forms each decision from match history and momentum shifts.</p>
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <td class="cta-wrap">
                <a href="https://globalsportstrade.vercel.app/deep-analyzer" class="cta" target="_blank">Try DeepAnalyzer Now</a>
                <a href="https://globalsportstrade.vercel.app/deep-analyzer" class="secondary" target="_blank">Learn More</a>
                <div style="margin-top:12px; color:#bda7e6; font-size:13px;">Accurate. Explainable. Always one step ahead.</div>
              </td>
            </tr>

            

            <tr>
              <td class="footer">
                <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap;">
                  <div>
                    <div style="font-weight:700; color:#fff;">Powered by DeepAnalyzer</div>
                    <div class="small">Your AI companion for accurate, data-driven football predictions.</div>
                  </div>
                  <div style="text-align:right; min-width:160px;">
                    <div style="font-size:12px; color:#bfaee6;">Manage preferences or <a href="https://globalsportstrade.vercel.app/unsubscribe?email=',email,'" style="color:#ff9ac4; text-decoration:none;">unsubscribe</a>.</div>
                  </div>
                </div>

                <div class="small" style="margin-top:12px;">
                  This email was sent to <strong>',email,'</strong>.  
                  If you were forwarded this message and want it delivered to your inbox,  
                  <a href="https://globalsportstrade.vercel.app/register" style="color:#ff9ac4; text-decoration:none;">create an account</a>.
                </div>
              </td>
            </tr>

          </tbody></table>
        </td>
      </tr>
    </tbody></table>
  </div>

</body><!--
--></html>')
FROM users WHERE users.id = 14;


INSERT INTO mail_queue(send_to, subject, html_body) SELECT email, "New tool: Deep Analyzer - AI match analysis",
CONCAT('
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <title>Today\'s High-Odd Fixtures - GST</title>
    <style>
        :root { color-scheme: light dark; supported-color-schemes: light dark; }
        body { margin: 0; padding: 0; font-family: \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif; background-color: transparent !important; }
        .email-wrapper { width: 100%; background-color: transparent !important; padding: 10px 0; }
        .container { max-width: 550px; margin: 0 auto; background-color: #15191d !important; border-radius: 12px; overflow: hidden; border: 1px solid #2d3339; }
        .header { padding: 30px 20px 15px; text-align: center; background-color: #15191d !important; }
        .logo-img { width: 70px; height: auto; margin-bottom: 10px; }
        .logo-text { font-size: 18px; font-weight: 800; letter-spacing: 2px; color: #ffffff !important; text-transform: uppercase; display: block; }
        .content { padding: 25px; line-height: 1.6; background-color: #15191d !important; }
        h1 { color: #ffffff !important; font-size: 20px; margin-top: 0; text-align: center; }
        p { color: #abb2bf !important; font-size: 15px; text-align: left; }
        
        /* Fixture List Style */
        .fixture-list { background-color: #1c2127 !important; border-radius: 8px; padding: 15px; margin: 20px 0; border: 1px dashed #2d3339; }
        .fixture-item { color: #ffffff !important; font-size: 14px; padding: 10px 0; border-bottom: 1px solid #2d3339; text-align: center; list-style: none; }
        .fixture-item:last-child { border-bottom: none; }
        
        /* Promo Box */
        .promo-box { background-color: #7f1d1d !important; color: #ffffff !important; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; display: block; text-decoration: none;}
        .promo-code { font-size: 24px; font-weight: 900; letter-spacing: 2px; display: block; margin-top: 5px; }

        .cta-container { text-align: center; padding: 15px 0; }
        .button { background-color: #7f1d1d !important; color: #ffffff !important; padding: 15px 35px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; text-transform: uppercase; font-size: 14px; }
        
        .footer { padding: 25px; text-align: center; font-size: 11px; color: #5c6370 !important; background-color: #0e1216 !important; }
        .footer a { color: #7f1d1d !important; text-decoration: none; }

        @media (prefers-color-scheme: dark) {
            .container, .header, .content { background-color: #15191d !important; }
            .fixture-list { background-color: #1c2127 !important; }
            h1, .logo-text, .fixture-item { color: #ffffff !important; }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="container">
            <div class="header">
                <img src="https://gsportstrade.com/logo.png" alt="GST Logo" class="logo-img">
                <span class="logo-text">GLOBAL SPORTS TRADE</span>
            </div>

            <div class="content">
                <h1>1,000+ Odds Now Available 📈</h1>
                <p>Hi ',first_name,',</p>

<p>Today\'s high-precision AI selections are live. We have identified 7 premium fixtures with a combined potential of approximately 1,000 odds.</p>

                <div class="fixture-list">
                    <div class="fixture-item">⚽ Sporting San Jose vs LD Alajuelense</div>
                    <div class="fixture-item">⚽ Perez Zeledon vs Puntarenas FC</div>
                    <div class="fixture-item">⚽ Tigres UANL vs Guadalajara Chivas</div>
                    <div class="fixture-item">⚽ Antigua GFC vs Municipal</div>
                    <div class="fixture-item">⚽ Alianza vs FAS</div>
                    <div class="fixture-item">⚽ Nacional Asuncion vs Cerro Porteno</div>
                    <div class="fixture-item">⚽ Diriangén vs Real Estelí</div>
                </div>

                <a href="https://gsportstrade.com/coupon/special50" class="promo-box">
                    <span style="font-weight: 600;">GET 50% OFF TODAY ONLY</span>
                    <span class="promo-code">SPECIAL50</span>
                </a>

                <div class="cta-container">
                    <a href="https://gsportstrade.com" class="button">Access Predictions</a>
                </div>
            </div>

            <div class="footer">
                <p>© 2026 Global Sports Trade. All rights reserved.</p>
                <p><a href="https://gsportstrade.com/about">About GST</a> | <a href="https://gsportstrade.com/contact">Support Center</a></p>
                <div style="margin-top:15px; color: #4b5263 !important;">Gamble Responsibly | 18+ Only</div>
            </div>
        </div>
    </div>

</body></html>')
FROM users WHERE users.id = 14;

INSERT INTO mail_queue(send_to, subject, html_body) SELECT email, "Your Weekend Fixtures Request Has Been Processed",
CONCAT('
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <title>Today\'s Analysis Is Ready — GST</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0 !important; padding: 0 !important; background-color: #0a0a0f; width: 100% !important; }
    a { color: inherit; }

    u + #body .gmail-fix { display: block !important; }

    [data-ogsc] body, [data-ogsb] body { background-color: #0a0a0f !important; }
    [data-ogsc] .force-bg, [data-ogsb] .force-bg { background-color: #0a0a0f !important; }
    [data-ogsc] .card-bg, [data-ogsb] .card-bg { background-color: #1a1a2e !important; }
    [data-ogsc] *, [data-ogsb] * { color: inherit !important; }

    /* iOS Mail dark mode override — prevents white background inversion */
    @media (prefers-color-scheme: dark) {
      body { background-color: #0a0a0f !important; color: #ffffff !important; }
      .force-bg { background-color: #0a0a0f !important; }
      .card-bg { background-color: #1a1a2e !important; }
      .ios-invert { background-color: #0a0a0f !important; }
      /* Prevent iOS from applying -apple-color-filter on these elements */
      body, table, td, div, p, span, a {
        -webkit-color-filter: none !important;
        color-filter: none !important;
      }
    }

    /* Explicit light mode — lock colors even when system is light */
    @media (prefers-color-scheme: light) {
      body { background-color: #0a0a0f !important; }
      .force-bg { background-color: #0a0a0f !important; }
      .card-bg { background-color: #1a1a2e !important; }
    }

    @media only screen and (max-width: 600px) {
      .email-wrapper { width: 100% !important; }
      .content-block { padding: 30px 20px !important; }
      .hero-title { font-size: 28px !important; line-height: 1.2 !important; }
      .cta-button { padding: 16px 32px !important; font-size: 16px !important; }
      .stat-cell { display: block !important; width: 100% !important; padding: 10px 0 !important; }
    }
  </style>
</head>
<body id="body" bgcolor="#0a0a0f" style="margin:0;padding:0;background-color:#0a0a0f;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;">

  <!-- Preheader hidden preview text -->
  <div style="display:none;font-size:1px;color:#0a0a0f;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    Your daily AI-powered sports analysis report is ready. See what our model flagged for today. &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847;
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#0a0a0f" class="force-bg ios-invert" style="background-color:#0a0a0f;color-scheme:only;">
    <tr>
      <td align="center" style="padding:20px 10px;">

        <table class="email-wrapper" role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;width:100%;">

          <!-- HEADER -->
          <tr>
            <td style="padding:0 20px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <!-- Logo + Name -->
                  <td style="padding:12px 0;" valign="middle">
                    <a href="https://gsportstrade.com" target="_blank" style="text-decoration:none;display:inline-block;">
                      <img src="https://gsportstrade.com/assets/logo.png" alt="GST Logo" width="30" height="30" style="border-radius:8px;margin-right:10px;display:inline-block;vertical-align:middle;" />
                      <span style="font-size:18px;font-weight:700;color:#ffffff;vertical-align:middle;letter-spacing:0.5px;">GST</span>
                    </a>
                  </td>
                  <!-- Nav link -->
                  <td align="right" style="padding:12px 0;" valign="middle">
                    <a href="https://gsportstrade.com" target="_blank" style="display:inline-block;background:linear-gradient(135deg,#ea580c,#f97316);color:#ffffff;font-size:12px;font-weight:700;padding:7px 18px;border-radius:20px;text-decoration:none;letter-spacing:0.5px;">Open App</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- SPACER -->
          <tr><td style="height:16px;"></td></tr>

          <!-- HERO -->
          <tr>
            <td style="border-radius:20px;overflow:hidden;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td class="content-block" style="padding:50px 40px 40px 40px;text-align:center;">

                    <!-- Live badge -->
                    <div style="display:inline-block;background:rgba(34,197,94,0.15);border:1px solid rgba(34,197,94,0.5);border-radius:50px;padding:6px 18px;margin-bottom:24px;">
                      <span style="color:#22c55e !important;font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;"><font color="#22c55e">&#x25CF; Live Now</font></span>
                    </div>

                    <!-- Title -->
                    <h1 class="hero-title" style="font-size:36px;font-weight:900;color:#ffffff !important;line-height:1.15;margin-bottom:16px;letter-spacing:-0.5px;">
                      <font color="#ffffff">Today\'s AI Analysis<br />
                      <span style="color:#fb923c !important;"><font color="#fb923c">Report Is Ready</font></span></font>
                    </h1>

                    <!-- Body -->
                    <p style="color:#b3b3cc !important;font-size:16px;line-height:1.7;max-width:440px;margin:0 auto 32px auto;">
                      <font color="#b3b3cc">Our model has finished processing today\'s fixtures. The results — including confidence scores and selections — are now live on your dashboard.</font>
                    </p>

                    <!-- Primary CTA -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                      <tr>
                        <td style="border-radius:50px;background:linear-gradient(135deg,#ea580c,#f97316);box-shadow:0 8px 30px rgba(234,88,12,0.5);">
                          <a class="cta-button" href="https://gsportstrade.com" target="_blank" style="display:inline-block;padding:18px 48px;font-size:18px;font-weight:800;color:#ffffff;text-decoration:none;border-radius:50px;letter-spacing:0.5px;">
                            View Today\'s Report &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- SPACER -->
          <tr><td style="height:24px;"></td></tr>

          <!-- STATS -->
          <tr>
            <td>
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td class="stat-cell" width="33%" style="padding:0 6px 0 0;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td bgcolor="#1a1a2e" class="card-bg" style="background:linear-gradient(135deg,#1a1a2e,#16213e);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:20px;text-align:center;">
                          <p style="font-size:26px;font-weight:900;color:#fb923c !important;margin-bottom:4px;"><font color="#fb923c">94%+</font></p>
                          <p style="font-size:11px;color:#808099 !important;text-transform:uppercase;letter-spacing:1.5px;"><font color="#808099">Min. Confidence</font></p>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td class="stat-cell" width="33%" style="padding:0 3px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td bgcolor="#1a1a2e" class="card-bg" style="background:linear-gradient(135deg,#1a1a2e,#16213e);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:20px;text-align:center;">
                          <p style="font-size:26px;font-weight:900;color:#fb923c !important;margin-bottom:4px;"><font color="#fb923c">AI</font></p>
                          <p style="font-size:11px;color:#808099 !important;text-transform:uppercase;letter-spacing:1.5px;"><font color="#808099">Powered Model</font></p>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td class="stat-cell" width="33%" style="padding:0 0 0 6px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td bgcolor="#1a1a2e" class="card-bg" style="background:linear-gradient(135deg,#1a1a2e,#16213e);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:20px;text-align:center;">
                          <p style="font-size:26px;font-weight:900;color:#fb923c !important;margin-bottom:4px;"><font color="#fb923c">Daily</font></p>
                          <p style="font-size:11px;color:#808099 !important;text-transform:uppercase;letter-spacing:1.5px;"><font color="#808099">Fresh Reports</font></p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- SPACER -->
          <tr><td style="height:24px;"></td></tr>

          <!-- HOW IT WORKS -->
          <tr>
            <td bgcolor="#1a1a2e" class="card-bg" style="background:linear-gradient(135deg,#1a1a2e,#16213e);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:28px 32px;">
              <p style="color:#808099 !important;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin-bottom:16px;"><font color="#808099">Quick Start</font></p>
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"><tr>
                      <td width="30" valign="top" style="color:#ea580c !important;font-weight:800;font-size:14px;padding-right:12px;"><font color="#ea580c">01</font></td>
                      <td style="color:#ccccdd !important;font-size:14px;"><font color="#ccccdd">Visit the platform and browse today\'s fixture list</font></td>
                    </tr></table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"><tr>
                      <td width="30" valign="top" style="color:#ea580c !important;font-weight:800;font-size:14px;padding-right:12px;"><font color="#ea580c">02</font></td>
                      <td style="color:#ccccdd !important;font-size:14px;"><font color="#ccccdd">Select the fixtures you want and add them to your cart</font></td>
                    </tr></table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"><tr>
                      <td width="30" valign="top" style="color:#ea580c !important;font-weight:800;font-size:14px;padding-right:12px;"><font color="#ea580c">03</font></td>
                      <td style="color:#ccccdd !important;font-size:14px;"><font color="#ccccdd">Complete checkout and access your selections instantly</font></td>
                    </tr></table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- SPACER -->
          <tr><td style="height:24px;"></td></tr>

          <!-- SECONDARY CTA -->
          <tr>
            <td style="text-align:center;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="border-radius:50px;border:2px solid rgba(234,88,12,0.6);">
                    <a href="https://gsportstrade.com" target="_blank" style="display:inline-block;padding:14px 40px;font-size:15px;font-weight:700;color:#fb923c;text-decoration:none;border-radius:50px;letter-spacing:0.5px;">
                      Go to Dashboard
                    </a>
                  </td>
                </tr>
              </table>
              <p style="color:#4d4d66 !important;font-size:12px;margin-top:14px;">
                <font color="#4d4d66">Reports refresh daily. Check back every morning for new analysis.</font>
              </p>
            </td>
          </tr>

          <!-- SPACER -->
          <tr><td style="height:32px;"></td></tr>

          <!-- DISCLAIMER -->
          <tr>
            <td style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:16px 20px;text-align:center;">
              <p style="color:#4d4d5e !important;font-size:11px;line-height:1.7;">
                <font color="#4d4d5e"><strong style="color:#666680 !important;"><font color="#666680">Responsible Use:</font></strong>
                Our reports are for informational and analytical purposes only. Always act responsibly. 18+ only. GST is not affiliated with any bookmaker or betting operator.</font>
              </p>
            </td>
          </tr>

          <!-- SPACER -->
          <tr><td style="height:32px;"></td></tr>

          <!-- FOOTER -->
          <tr>
            <td style="text-align:center;padding:24px 20px 30px 20px;border-top:1px solid rgba(255,255,255,0.06);">

              <a href="https://gsportstrade.com" target="_blank" style="text-decoration:none;display:inline-block;margin-bottom:8px;">
                <img src="https://gsportstrade.com/assets/logo.png" alt="GST Logo" width="36" height="36" style="border-radius:10px;display:inline-block;vertical-align:middle;margin-right:8px;" />
                <span style="font-size:18px;font-weight:900;color:#ffffff;letter-spacing:2px;vertical-align:middle;">GST</span>
              </a>
              <p style="color:#4d4d5e !important;font-size:11px;margin-bottom:16px;"><font color="#4d4d5e">Global Sports Trade</font></p>

              <p style="margin-bottom:16px;">
                <a href="https://gsportstrade.com" target="_blank" style="color:#666680 !important;font-size:12px;text-decoration:none;margin:0 10px;"><font color="#666680">Website</font></a>
                <a href="https://gsportstrade.com/about" target="_blank" style="color:#666680 !important;font-size:12px;text-decoration:none;margin:0 10px;"><font color="#666680">About</font></a>
                <a href="mailto:contact.globalsportstrade@gmail.com" style="color:#666680 !important;font-size:12px;text-decoration:none;margin:0 10px;"><font color="#666680">Contact Us</font></a>
              </p>

              <!-- Physical address (required for CAN-SPAM / GDPR) -->
              <p style="color:#3d3d4d !important;font-size:11px;line-height:1.8;margin-bottom:16px;">
                <font color="#3d3d4d">Global Sports Trade Ltd &bull; 124 City Road, London EC1V 2NX, United Kingdom</font>
              </p>

              <!-- Unsubscribe -->
              <p style="color:#3d3d4d !important;font-size:11px;line-height:1.8;">
                <font color="#3d3d4d">You are receiving this because you subscribed to GST daily updates.<br /></font>
                <a href="https://gsportstrade.com/unsubscribe/', email, '" style="color:rgba(234,88,12,0.7);text-decoration:underline;">Unsubscribe</a>
                &nbsp;&bull;&nbsp;
                <a href="https://gsportstrade.com/settings/preferences" style="color:rgba(234,88,12,0.7);text-decoration:underline;">Manage Preferences</a>
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
')
FROM users WHERE users.id = 14;