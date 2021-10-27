const hostname = "http://192.168.0.146";
const port = 5555;

var showId, showData, showRisk, yesVotes, noVotes, riskDescription;

function getShowInfo() {
  setTimeout(() => {
    chrome.storage.local.get("showTitle", ({ showTitle }) => {
      fetchShowInformation({
        keyword: showTitle,
      })
        .then((result) => {
          fetchTopicInformation({
            showId: result["id"],
          }).then((topicData) => {
            if (
              topicData[0]["itemName"] === undefined ||
              topicData[0]["isYes"] === undefined ||
              topicData[0]["yesSum"] === undefined ||
              topicData[0]["noSum"] === undefined
            ) {
              document.getElementById("showStatus").innerHTML = "Unavailable";
              document.getElementById("showStatusImg").src =
                "\\images\\src\\not-found.png";
              document.getElementById("showStatus").style.color = "#FDB62F";
              document.getElementById("showSum").innerHTML = "";
              document.getElementById("showComment").innerHTML =
                "Apologies, the show appears to be lacking information about this category so we cannot provide the details relevant to your search!";
              return;
            }

            showData = topicData[0]["TopicId"];

            document.getElementById("showTitle").innerHTML =
              topicData[0]["itemName"];

            showRisk = topicData[0]["isYes"]; // 1 indicates risky

            if (showRisk === 0) {
              document.getElementById("showStatus").innerHTML = "Safe!";
              document.getElementById("showStatusImg").src =
                "\\images\\src\\check.png";
            }

            if (showRisk === 1) {
              document.getElementById("showStatus").innerHTML = "Unsafe!";
              document.getElementById("showStatus").style.color = "#E04F5F";
              document.getElementById("showStatusImg").src =
                "\\images\\src\\danger.png";
            }

            yesVotes = topicData[0]["yesSum"];
            noVotes = topicData[0]["noSum"];
            totalVotes = yesVotes + noVotes;

            if (yesVotes > noVotes) {
              document.getElementById(
                "showSum"
              ).innerHTML = `${yesVotes} / ${totalVotes} votes`;
            } else {
              document.getElementById(
                "showSum"
              ).innerHTML = `${noVotes} / ${totalVotes} votes`;
            }

            riskDescription = topicData[0]["comment"];
            document.getElementById("showComment").innerHTML = riskDescription;
          });
        })
        .catch((rejected) => {
          console.log(rejected);
          document.getElementById("showStatus").innerHTML = "Unavailable";
          document.getElementById("showStatusImg").src =
            "\\images\\src\\not-found.png";
          document.getElementById("showStatus").style.color = "#FDB62F";
          document.getElementById("showSum").innerHTML = "";
          document.getElementById("showComment").innerHTML =
            "We don't appear to have information on this show at the moment. \n If you have watched this, please leave a review on our site!";
        });
    });
  }, 500);
}

getShowInfo();

async function fetchTopicInformation({ showId, categoryId, categoryString }) {
  const queryURL = `${hostname}:${port}/api/v1/doesthedogdie/show-info?showId=${
    showId || null
  }&categoryId=${categoryId || null}&categoryString=${categoryString || null}`;

  const queryHeader = {
    headers: {
      Accept: "application/json",
    },
    method: "GET",
  };

  const topicData = async () => {
    return await fetch(queryURL, queryHeader)
      .then((data) => data.json())
      .catch((rejected) => rejected.json());
  };

  return await topicData();
}

async function fetchShowInformation({ keyword }) {
  const queryURL = `${hostname}:${port}/api/v1/doesthedogdie/media-id?keyword=${
    keyword || null
  }`;

  const queryHeader = {
    headers: {
      Accept: "application/json",
    },
    method: "GET",
  };

  const showId = async () => {
    let decodedData = await fetch(queryURL, queryHeader)
      .then((data) => data.json())
      .catch((rejected) => rejected.json());
    return decodedData;
  };

  return await showId();
}
