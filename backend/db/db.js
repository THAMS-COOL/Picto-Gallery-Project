const mongoose = require('mongoose');

mongoose.connect(process.env.ATLAS_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true,
  useUnifiedTopology: true,
});

console.log('DB Connected');
