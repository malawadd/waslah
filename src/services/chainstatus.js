import axios from 'axios'

export const currentepoch = async () => {
  try {
    const url = 'https://api.zondax.ch/fil/data/v1/calibration/tipset/latest';
    const resp = await axios({
    method: 'GET',
    url,
    headers: {
        Authorization: "Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6ImtleS1iZXJ5eC0wMDEiLCJ0eXAiOiJKV1QifQ.eyJyb2xlcyI6W10sImlzcyI6IlpvbmRheCIsImF1ZCI6WyJiZXJ5eCJdLCJleHAiOjE2ODc2OTI3NzYsImp0aSI6ImdvbGRlbkZsYXlpbmdMaW9uLDB4Z29sZGVubGlvbkBnbWFpbC5jb20ifQ.DjaoHyjku7KGz-DLoTPJ4Mb0g1izXMMZV3tXtmdGZ_QHSrZjnTx5RnsY1cIdn7bthNwMjEhItK5LsAax_h7-7Q" ,
        "Content-Type": "application/json"
      }
  });
    return resp.data.height
  } catch (err) {
    return err
  }
}
