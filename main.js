const root = document.querySelector(":root");
const themeSwitch = document.querySelector("#theme-switch");
const themeSwitchText = document.querySelector("#theme-switch-text");
const themeIcon = document.querySelector("#theme-icon");
const errorMsg = document.querySelector("#error-message");
const searchResults = document.querySelector("#search-results");

function switchTheme() {
  root.classList.toggle("dark-theme");

  if (root.classList.contains("dark-theme")) {
    localStorage.setItem("theme", "dark");
    themeSwitchText.textContent = "Light";
    themeIcon.src = "./assets/icon-sun.svg";
  } else {
    localStorage.setItem("theme", "light");
    themeSwitchText.textContent = "Dark";
    themeIcon.src = "./assets/icon-moon.svg";
  }
}

if (localStorage.getItem("theme") === "dark") {
  switchTheme();
}

themeSwitch.addEventListener("click", switchTheme);
const isCorrectUsernameRegex = /^(?!.*--)[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/;

function isCorrectUsername(username) {
  return (
    isCorrectUsernameRegex.test(username) &&
    username.length > 0 &&
    username.length < 40
  );
}

async function fetchUser(username) {
  console.log(username);
  errorMsg.classList.add("hidden");

  if (!isCorrectUsername(username)) {
    return errorMsg.classList.remove("hidden");
  }

  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    const data = await response.json();

    console.log(response.status);
    if (!response.ok) {
      console.log("Error: ", data.message);
      return errorMsg.classList.remove("hidden");
    }

    return updateDOM(data);
  } catch (error) {
    console.log("Error: ", error);
  }
}

const searchBtn = document.querySelector("#search-btn");
const searchInput = document.querySelector("#search-input");

searchBtn.addEventListener("click", () => {
  fetchUser(searchInput.value);
});

searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    fetchUser(searchInput.value);
  }
});

function updateDOM(data) {
  const pfp = document.querySelector("#pfp");
  const name = document.querySelector("#name");
  const username = document.querySelector("#username");
  const joined = document.querySelector("#joined");
  const bio = document.querySelector("#bio");
  const repos = document.querySelector("#repos");
  const followers = document.querySelector("#followers");
  const following = document.querySelector("#following");

  pfp.src = data.avatar_url;
  name.textContent = data.name;
  username.textContent = `@${data.login}`;
  joined.textContent = `Joined ${data.created_at.slice(0, 10)}`;
  repos.textContent = data.public_repos;
  followers.textContent = data.followers;
  following.textContent = data.following;

  if (!data.bio) {
    bio.textContent = "This profile has no bio";
    bio.classList.add("opacity-75");
  } else {
    bio.textContent = data.bio;
  }

  const locationText = document.querySelector("#location-text");
  const twitterText = document.querySelector("#twitter-text");
  const blogText = document.querySelector("#website-text");
  const companyText = document.querySelector("#company-text");

  if (data.location) {
    locationText.textContent = data.location;
  } else {
    locationText.textContent = "Not Available";
    locationText.classList.add("opacity-50");
  }

  if (data.twitter_username) {
    twitterText.textContent = `@${data.twitter_username}`;
    twitterText.href = "https://twitter.com/" + data.twitter_username;
  } else {
    twitterText.textContent = "Not Available";
    twitterText.classList.add("opacity-50");
  }

  if (data.blog) {
    blogText.textContent = data.blog;
  } else {
    blogText.textContent = "Not Available";
    blogText.classList.add("opacity-50");
  }

  if (data.company) {
    companyText.textContent = data.company;
  } else {
    companyText.textContent = "Not Available";
    companyText.classList.add("opacity-50");
  }

  searchResults.classList.remove("hidden");
}
