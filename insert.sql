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