// ====== Firebase config (paste yours here) ======
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// DOM elements
const postBtn = document.getElementById("postBtn");
const postText = document.getElementById("postText");
const postCategory = document.getElementById("postCategory");
const feed = document.getElementById("feed");

// Post button click
postBtn.addEventListener("click", () => {
  const text = postText.value.trim();
  const category = postCategory.value;

  if(text === "") return;

  db.collection("posts").add({
    text,
    category,
    timestamp: Date.now(),
    oinks: 0
  });

  postText.value = "";
});

// Real-time listener
db.collection("posts").orderBy("timestamp", "desc").onSnapshot(snapshot => {
  feed.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    const postEl = document.createElement("div");
    postEl.classList.add("post");

    // Post content
    postEl.innerHTML = `
      <span class="category">[${data.category}]</span> ${data.text}
      <div>
        <button class="oinkBtn" data-id="${doc.id}">🐷 Oink (${data.oinks})</button>
      </div>
    `;

    feed.appendChild(postEl);
  });

  // Add event listeners to Oink buttons
  const oinkBtns = document.querySelectorAll(".oinkBtn");
  oinkBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const postId = btn.getAttribute("data-id");
      const postRef = db.collection("posts").doc(postId);

      // Increment oinks count
      postRef.update({
        oinks: firebase.firestore.FieldValue.increment(1)
      });
    });
  });
});
