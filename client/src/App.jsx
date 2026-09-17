import React from "react";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

const App = () => {
  const [urls, setUrls] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [currentUrl, setCurrentUrl] = useState(null);

  // get all urls
  async function fetchUrls() {
    const response = await axios.get("http://localhost:5173/api/url");

    const responseData = response.data;

    setUrls(responseData.data.urls);
  }

  // create shortUrl
  async function createShortUrl() {
    const response = await axios.post("http://localhost:5173/api/url", {
      url: inputValue,
    });

    setCurrentUrl({
      originalUrl: response.data.data.originalUrl,
      shortCode: response.data.data.shortCode,
    });

    fetchUrls()
  }

  // delete url
  async function deleteUrl(id) {
    await axios.delete(`http://localhost:5173/api/url/${id}`)

    fetchUrls()
  }

  useEffect(() => {
    fetchUrls();
  }, []);

  return (
    <main className="w-full flex flex-col justify-center p-4">
      <div className="flex gap-4">
        <input
          className="border w-2xl rounded px-3"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter long URL..."
        />
        <button
          onClick={createShortUrl}
          className="bg-blue-600 rounded px-4 py-2 text-white cursor-pointer"
        >
          Shorten
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {urls.map((url) => {
          return (
            <div key={url._id} className="flex gap-5">
              <a
                href={`http://localhost:3000/${url.shortCode}`}
                target="_blank"
              >
                {url.shortCode}
              </a>
              <p className="truncate">{url.originalUrl}</p>
              <p>{url.clicks}</p>
              <div className="flex gap-2">
                <button className="bg-blue-600 rounded px-3 py-1 text-white">
                  COPY
                </button>
                <button onClick={() => deleteUrl(url._id)} className="bg-blue-600 rounded px-3 py-1 text-white">
                  DELETE
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default App;
