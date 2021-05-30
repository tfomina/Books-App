const roomName = location.pathname.split("/").pop();
const socket = io.connect("/", { query: `roomName=${roomName}` });

const addComment = async () => {
  const bookId = location.pathname.split("/").pop();
  const comment = document.getElementById("comment").value;

  if (!comment) return false;

  document.getElementById("submit").setAttribute("disabled", "disabled");

  try {
    const result = await axios.post("/books/addComment", {
      bookId,
      comment,
    });

    const {
      data: { status },
    } = result;

    if (status === "error") {
      onError();
    }
    onSuccess();
  } catch (e) {
    onError();
  }
};

const onSuccess = () => {
  document.getElementById("comment").value = "";
  document.getElementById("submit").removeAttribute("disabled");
  document.getElementById(
    "result"
  ).innerHTML = `<div class="alert alert alert-success alert-dismissible fade show" role="alert">
        Комментарий успешно добавлен
        <button
        type="button"
          class="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
        ></button>
      </div>`;
};

const onError = () => {
  document.getElementById("submit").removeAttribute("disabled");
  document.getElementById(
    "result"
  ).innerHTML = `<div class="alert alert alert-danger alert-dismissible fade show" role="alert">
        Ошибка при добавлении комментария
        <button
        type="button"
          class="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
        ></button>
      </div>`;
};
