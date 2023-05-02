import { FC } from "react";
import { useRouter } from 'next/router';
import http from 'http';

const Home: FC = () => {

  const router = useRouter()

  const handleChange = async (event: any) => {
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.onload = function (e) {
      // when file is read
      if (reader.result) {
        const options = {
          path: '/api/uploadLog',
          method: 'POST'
        };
        const content = reader.result.toString();
        const req = http.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });

          res.on('end', () => {
            router.push({
              pathname: '/analyze',
              query: { logId: JSON.parse(data).message },
            });
            console.log(data)
          })
        });
        req.write(content);
        req.end();
      };
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-row items-center justify-center h-screen">
      <div className="mr-6">
        Upload a CS:GO match data file to have it analyzed.
      </div>
      <input id="fileInput" role="fileInput" type="file" accept=".txt" onChange={handleChange} />
    </div>
  )
}

export default Home;