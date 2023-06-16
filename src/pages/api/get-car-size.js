import axios from 'axios'
const fs = require('fs');

export default function handler(req, res) {
  switch (req.method) {
    case 'POST':
       return carSize(req, res)
  }
}

async function carSize(req, res) {
  const filePath = './file.car';
  await downloadFile(req.body.fileUrl, filePath)
  console.log('File downloaded successfully!');
  const fileSize = fs.statSync(filePath).size;
  console.log(`Size: ${fileSize} bytes`);
  fs.unlinkSync(filePath);
 
  res.json({
    fileSize
  })
}


const downloadFile = async (url, path) => {
  const response = await axios({
    method: 'GET',
    url,
    responseType: 'stream',
  });

  const writer = fs.createWriteStream(path);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};