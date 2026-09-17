import { useEffect, useState } from "react";
import axios from "axios";

const BACKEND_URL = "http://localhost:3000";

const App = () => {
  const [urls, setUrls] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState("");

  // fetch all urls
  async function fetchUrls() {
    try {
      const response = await axios.get("/api/url");
      setUrls(response.data.data.urls);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch URLs");
    }
  }

  // create short url
  async function createShortUrl() {
    if (!inputValue.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    try {
      await axios.post("/api/url", { url: inputValue });
      setInputValue("");
      await fetchUrls();
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  }

  // delete url
  async function deleteUrl(id) {
    try {
      await axios.delete(`/api/url/${id}`);
      await fetchUrls();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete URL");
    }
  }

  async function copyShortUrl(shortCode, id) {
    const shortUrl = `${BACKEND_URL}/${shortCode}`;

    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedId(id);
      setTimeout(() => setCopiedId(""), 1500);
    } catch (err) {
      setError("Clipboard access failed. Please copy manually.");
    }
  }

  useEffect(() => {
    fetchUrls();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8 text-gray-800">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">URL Shortener</h1>
        </div>

        <div className="mb-6 flex flex-col gap-3 md:flex-row">
          <input
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter long URL"
          />
          <button
            onClick={createShortUrl}
            disabled={loading}
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-500 disabled:opacity-60"
          >
            {loading ? "Loading..." : "Shorten"}
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-3">
          {urls.length === 0 ? (
            <div className="rounded-md border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">
              No shortened links yet.
            </div>
          ) : (
            urls.map((url) => {
              const shortUrl = `${BACKEND_URL}/${url.shortCode}`;

              return (
                <div
                  key={url._id}
                  className="rounded-md border border-gray-200 bg-white p-3"
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <a
                      href={shortUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-blue-600 underline"
                    >
                      {url.shortCode}
                    </a>
                    <span className="text-xs text-gray-500">
                      {url.clicks} clicks
                    </span>
                  </div>

                  <p className="mb-3 truncate text-sm text-gray-600">
                    {url.originalUrl}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => copyShortUrl(url.shortCode, url._id)}
                      className="rounded-md border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm hover:bg-gray-100"
                    >
                      {copiedId === url._id ? "Copied" : "Copy"}
                    </button>
                    <button
                      onClick={() => deleteUrl(url._id)}
                      className="rounded-md bg-red-500 px-3 py-1.5 text-sm text-white hover:bg-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
};

export default App;
