import React, { useState, useEffect } from "react";
import "./App.css";

const NumberSearchApp = () => {
  const [formData, setFormData] = useState({
    startWith: "9130",
    endWith: "7",
    shouldHave: "1,3,5,7,9",
    avoidNo: "2,4,8",
    totalSum: "7",
    limit: "100",
    appearOnce: "",
    appeartwice: "",
  });
  const [results, setResults] = useState([]);
  const [allMatchingResults, setAllMatchingResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchStatus, setSearchStatus] = useState("idle");

  const numbersPerPage = 100; // Set the chunk size per page (100 numbers)

  // Helper function to calculate the digit root
  const getDigitRoot = (number) => {
    let sum = 0;
    while (number > 0) {
      sum += number % 10;
      number = Math.floor(number / 10);
    }
    return sum > 9 ? getDigitRoot(sum) : sum;
  };

  // Function to generate and filter numbers
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSearchStatus("searching");

    const {
      startWith,
      endWith,
      shouldHave,
      avoidNo,
      totalSum,
      appearOnce,
      appeartwice,
    } = formData;

    // Parse inputs
    const shouldHaveArray = shouldHave.split(",").map((num) => num.trim());
    const avoidNoArray = avoidNo.split(",").map((num) => num.trim());
    const appearOnceArray = appearOnce.split(",").map((num) => num.trim());
    const appeartwiceArray = appeartwice.split(",").map((num) => num.trim());
    const totalSumNumber = parseInt(totalSum, 10);

    const startRange = 9130000007; // Fixed as per requirements
    const endRange = 9130999997; // Fixed as per requirements

    // Filter matching results
    const matchingResults = [];

    for (let i = startRange; i <= endRange; i++) {
      const numStr = i.toString();

      // Check start and end
      if (!numStr.startsWith(startWith) || !numStr.endsWith(endWith)) continue;

      // Check for required digits
      if (shouldHaveArray.some((digit) => !numStr.includes(digit))) continue;

      // Check for avoided digits
      if (avoidNoArray.some((digit) => numStr.includes(digit))) continue;

      // Check digit root
      if (getDigitRoot(i) !== totalSumNumber) continue;

      // Check for digits that should appear only once
      const digitCountOnce = {};
      numStr.split("").forEach((digit) => {
        digitCountOnce[digit] = (digitCountOnce[digit] || 0) + 1;
      });

      if (appearOnceArray.some((digit) => digitCountOnce[digit] > 1)) continue;

      // Check for digits that should appear only once
      const digitCountTwice = {};
      numStr.split("").forEach((digit) => {
        digitCountTwice[digit] = (digitCountTwice[digit] || 0) + 1;
      });
      if (appeartwiceArray.some((digit) => digitCountTwice[digit] < 3))
        continue;

      matchingResults.push(i);
    }

    // Update state with results
    setAllMatchingResults(matchingResults);
    setTotalResults(matchingResults.length);
    setResults(matchingResults.slice(0, numbersPerPage)); // Show first page results
    setLoading(false);
    setCurrentPage(1); // Reset to first page
    setSearchStatus(matchingResults.length > 0 ? "completed" : "no-results");
  };

  // Handle page navigation
  const handleNextPage = () => {
    setCurrentPage((prevPage) =>
      Math.min(prevPage + 1, Math.ceil(totalResults / numbersPerPage))
    );
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // useEffect to update results based on the current page
  useEffect(() => {
    const startIndex = (currentPage - 1) * numbersPerPage;
    const endIndex = startIndex + numbersPerPage;
    setResults(allMatchingResults.slice(startIndex, endIndex));
  }, [currentPage, allMatchingResults]); // Dependency on currentPage and allMatchingResults

  return (
    <div className="column-content">
      <section className="left-section-search">
        <form onSubmit={handleSubmit} className="form-search">
          <div>
            <label>
              <span>Start With:</span>
              <input
                type="text"
                id="startWith"
                name="startWith"
                value={formData.startWith}
                onChange={(e) =>
                  setFormData({ ...formData, startWith: e.target.value })
                }
              />
            </label>
            <label>
              <span>End With:</span>
              <input
                type="text"
                id="endWith"
                name="endWith"
                value={formData.endWith}
                onChange={(e) =>
                  setFormData({ ...formData, endWith: e.target.value })
                }
              />
            </label>
            <label>
              <span>Should Have (comma-separated):</span>
              <input
                type="text"
                id="shouldHave"
                name="shouldHave"
                value={formData.shouldHave}
                onChange={(e) =>
                  setFormData({ ...formData, shouldHave: e.target.value })
                }
              />
            </label>
            <label>
              <span>Avoid No (comma-separated):</span>
              <input
                type="text"
                id="avoidNo"
                name="avoidNo"
                value={formData.avoidNo}
                onChange={(e) =>
                  setFormData({ ...formData, avoidNo: e.target.value })
                }
              />
            </label>
            <label>
              <span>Should Appear Once (comma-separated):</span>
              <input
                type="text"
                id="appearOnce"
                name="appearOnce"
                value={formData.appearOnce}
                onChange={(e) =>
                  setFormData({ ...formData, appearOnce: e.target.value })
                }
              />
            </label>
            <label>
              <span>Should Appear Twice (comma-separated):</span>
              <input
                type="text"
                id="appeartwice"
                name="appeartwice"
                value={formData.appeartwice}
                onChange={(e) =>
                  setFormData({ ...formData, appeartwice: e.target.value })
                }
              />
            </label>
            <label>
              <span>Total Sum:</span>
              <input
                type="number"
                id="totalSum"
                name="totalSum"
                value={formData.totalSum}
                onChange={(e) =>
                  setFormData({ ...formData, totalSum: e.target.value })
                }
              />
            </label>
            <label>
              <span>Limit:</span>
              <input
                type="number"
                id="limit"
                name="limit"
                value={formData.limit}
                onChange={(e) =>
                  setFormData({ ...formData, limit: e.target.value })
                }
              />
            </label>
          </div>
          <div className="flex-end">
            <button type="submit">Search</button>
          </div>
        </form>
      </section>
      <section className="right-section-result">
        {loading && <p>Loading...</p>}

        {searchStatus === "no-results" && !loading && (
          <p>No results found for the current page.</p>
        )}
        <div className="pagination">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            Prev
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage * numbersPerPage >= totalResults}
          >
            Next
          </button>
        </div>
        {searchStatus === "completed" && (
          <>
            <p>Total Results Found: {totalResults}</p>
            <ul className="searchResult">
              {results.map((result) => {
                const resultStr = result.toString();
                const digitCount = {};

                // Count occurrences of each digit
                resultStr.split("").forEach((digit) => {
                  digitCount[digit] = (digitCount[digit] || 0) + 1;
                });

                return (
                  <li key={result}>
                    {resultStr.split("").map((digit, index) => (
                      <span
                        key={index}
                        style={{
                          backgroundColor:
                            digitCount[digit] > 1 ? "yellow" : "transparent",
                        }}
                      >
                        {digit}
                      </span>
                    ))}
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </section>
    </div>
  );
};

export default NumberSearchApp;
