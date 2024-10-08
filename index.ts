import express from 'express';
import router from './routes/routes';
const app = express();
const PORT = process.env.PORT || 8000;
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use('/', router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
