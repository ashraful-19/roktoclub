const express = require ("express");
const app = express();
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine","ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const fs = require('fs');
const { createPayment, executePayment } = require('bkash-payment');

const bodyParser = require('body-parser');
const { exec } = require('child_process');



const PORT = process.env.PORT ||9000;
// Serve static files (like HTML and CSS)
app.use(express.static('public'));
const bkashConfig = {
    base_url: 'https://tokenized.pay.bka.sh/v1.2.0-beta',
    username: '01839886977',
    password: '.&$9Bc{KD-i',
    app_key: 'sEJzTU0Ov1KgoBj8ebUT5lnTtc',
    app_secret: 'J8qfRS7JbtjFXCh6vG7wawLxGVOT9zk9s0RYYpK2ZsR9UfxRMth3'
  };
  






app.get('/', (req, res) => {

      res.render('index'); 
});




app.get('/', async (req, res) => {
  const filePath = path.join(__dirname, 'views', 'store.json');

  try {
    const data = await fs.readFile(filePath, 'utf8'); // Read file with utf8 encoding
    let donors = JSON.parse(data); // Parse JSON data
    donors.reverse(); // Reverse the array

    // Pass data to EJS
  } catch (error) {
    console.error('Error reading or parsing JSON file:', error);
    res.status(500).json({ error: 'Error reading file' }); // Handle errors
  }
})

app.post('/save-donor', (req, res) => {
  const donorData = req.body;

  // Add the current date and time as registration date
  donorData.registration = new Date().toISOString();

  const filePath = path.join(__dirname, 'views', 'store.json');

  // Read existing data
  fs.readFile(filePath, 'utf8', (err, data) => {
      let donors = [];

      if (!err && data) {
          donors = JSON.parse(data);
      }

      // Set default values
      donorData.notes = '';
      donorData.last_clicked = '';
      donorData.attempts_count = 0;

      // Check the last donor's donor_id and increment by 1
      let newDonorId = 1;
      if (donors.length > 0) {
          const lastDonor = donors[donors.length - 1];
          newDonorId = lastDonor.donor_id ? lastDonor.donor_id + 1 : 1;
      }

      donorData.donor_id = newDonorId; // Assign the new donor ID

      // Add new donor data
      donors.push(donorData);

      // Write updated data
      fs.writeFile(filePath, JSON.stringify(donors, null, 2), (err) => {
          if (err) {
              console.error('Error writing file:', err);
              res.status(500).json({ error: 'Failed to save data' });
          } else {
              res.json({ success: true });
          }
      });
  });
});


app.get('/search-blood', (req, res) => {
  const { division, district, upazila, fetchAll, bloodGroup } = req.query;
  const filePath = path.join(__dirname, 'views', 'store.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading file' });
    }

    let donors = JSON.parse(data);
    console.log('Initial donors:', donors); // Log initial donor data

    const ninetyDaysInMillis = 90 * 24 * 60 * 60 * 1000; // 90 days in milliseconds
    const today = new Date();

  

    // If fetchAll is not true, apply filters (including division, district, upazila, and bloodGroup)
     if (fetchAll !== 'true') {
      console.log('Applying filters...'); // Log filter application

      // Filter donors based on query parameters except for 'fetchAll'
      donors = donors.filter(donor =>
        (division ? donor.division_en === division : true) &&
        (district ? donor.district_en === district : true) &&
        (upazila ? donor.upazila_en === upazila : true) &&
        (bloodGroup ? donor['blood-group'] === bloodGroup : true) &&
        (!donor.last_clicked || donor.last_clicked === "") && // Only include donors without a 'last_clicked' date
        (
          !donor['last-donation'] || // Include if no donation history
          (new Date(donor['last-donation']) <= new Date(today.getTime() - ninetyDaysInMillis)) // Include if last donation >= 90 days ago
        )
      );

      console.log('Filtered donors:', donors); // Log donors after filtering
    } else {
      // For fetchAll = true, apply only the last_clicked and 90-day donation filter
      donors = donors.filter(donor =>
        (!donor.last_clicked || donor.last_clicked === "") && // Only include donors without a 'last_clicked' date
        (
          !donor['last-donation'] || // Include if no donation history
          (new Date(donor['last-donation']) <= new Date(today.getTime() - ninetyDaysInMillis)) // Include if last donation >= 90 days ago
        )
      );

      console.log('Donors after last_clicked filtering and 90-day check:', donors); // Log donors after filtering
    }

    // Sort donors by `attempts_count` in ascending order (lowest attempts come first)
    donors.sort((a, b) => (a.attempts_count || 0) - (b.attempts_count || 0));
    console.log('Sorted donors:', donors); // Log donors after sorting

    // Limit the result to 200 donors
    donors = donors.slice(0, 100);
    console.log('Limited donors to 200:', donors); // Log limited donors

    // Return the filtered and sorted donors
    res.json(donors);
  });
});

app.post('/update-donor-attempt', (req, res) => {
  const { phoneNumber } = req.body; // Get phone number from the request body
  console.log(phoneNumber)
  const filePath = path.join(__dirname, 'views', 'store.json'); // Path to your JSON file

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading file' });
    }

    let donors = JSON.parse(data); // Parse the donor data

    // Find the donor by phone number
    let donor = donors.find(d => d.phone === phoneNumber);

    if (!donor) {
      return res.status(404).json({ error: 'Donor not found' });
    }

    // Increment the attempts count and update last clicked date
    donor.attempts_count = (donor.attempts_count || 0) + 1;
    donor.last_clicked = new Date().toISOString(); // Store the current date as ISO string

    console.log(donor.attempts_count)
    // Write the updated donors back to the store.json file
    fs.writeFile(filePath, JSON.stringify(donors, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error writing file' });
      }

      res.json({ message: 'Donor updated successfully' });
    });
  });
});





app.get('/blood-registration', (req, res) => {
      res.render('registration'); 
});



app.get('/donate-us', (req, res) => {
        res.render('donate-us'); 
    });
  
app.get('/about-us', (req, res) => {
      res.render('about-us'); 
});

app.get('/contact-us', (req, res) => {
  res.render('contact-us'); 
});

app.get('/terms-and-conditions', (req, res) => {
  res.render('terms'); 
});





  
  


app.get('/process-payment', async (req, res) => {
    try {
      const { donation } = req.query;
  
      const paymentDetails = {
        amount: donation,
        callbackURL: 'https://roktoclub.org/bkash-callback'
      };
  
      const result = await createPayment(bkashConfig, paymentDetails);
  
      res.redirect(result?.bkashURL);
    } catch (e) {
      console.log(e);
      res.status(500).send('Payment initiation failed. Please try again.');
    }
  });
  
  app.get('/bkash-callback', async (req, res) => {
    try {
      const { status, paymentID } = req.query;
  
      if (status === 'success') {
        const result = await executePayment(bkashConfig, paymentID);
  
        if (result?.transactionStatus === 'Completed') {
          // Extract the payment phone number from the result
          const paymentPhone = result?.payerInfo?.payerPhone;
  
          const donationData = {
            paymentPhone,
            amount: result?.amount || 0,
          };
  
          // Save to donation.json
          const filePath = path.join(__dirname,'views', 'donation.json');
          let donations = [];
  
          if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            donations = JSON.parse(data);
          }
  
          donations.push(donationData);
  
          fs.writeFileSync(filePath, JSON.stringify(donations, null, 2), 'utf8');
  
          res.send(`
            <html>
              <body>
                <h1>Thank you for your donation!</h1>
                <p>Your donation of ${donationData.amount} has been successfully processed.</p>
                <a href="/">Go back to the donation page</a>
              </body>
            </html>
          `);
        } else {
          res.status(400).send(`
            <html>
              <body>
                <h1>Your payment failed. Please try again.</h1>
                <a href="/">Retry</a>
              </body>
            </html>
          `);
        }
      } else {
        res.status(400).send(`
          <html>
            <body>
              <h1>Your payment failed. Please try again.</h1>
              <a href="/">Retry</a>
            </body>
          </html>
        `);
      }
    } catch (e) {
      console.log(e);
      res.status(500).send('Error processing the payment.');
    }
  });


  
// Webhook route for handling GitHub events
app.post('/web-hooks', (req, res) => {
  const event = req.headers['x-github-event'];
  console.log(`Received event: ${event}`);

  if (event === 'push') {
      // Modify the command to stash changes before pulling
      exec('cd /home/roktoclub && git stash && git pull && npm install && pm2 restart roktoclub', (err, stdout, stderr) => {
          if (err) {
              console.error(`Exec error: ${err.message}`);
              return res.status(500).send('Server Error');
          }
          if (stderr) {
              console.error(`Stderr: ${stderr}`);
              return res.status(500).send('Server Error');
          }
          console.log(`Stdout: ${stdout}`);
          res.status(200).send('Update successful');
      });
  } else {
      console.log(`Unsupported event: ${event}`);
      res.status(400).send('Event not supported');
  }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
