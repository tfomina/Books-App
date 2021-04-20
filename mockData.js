const fs = require("fs");
const path = require("path");
const { nanoid } = require("nanoid");
const { Book } = require("./src/models");

const TITLES = [
  "Lorem ipsum dolor sit amet",
  "Sed efficitur rhoncus gravida",
  "Praesent tincidunt mi erat",
  "Ut dignissim lacus diam",
  "Class aptent taciti sociosqu",
];

const DESCRIPTION =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer iaculis augue in dolor molestie, eu ultricies lacus tempus. In aliquet arcu dolor, sed efficitur enim tempor vitae. Aliquam eget hendrerit erat. Phasellus sit amet laoreet quam, nec blandit tellus. Nullam a risus mi. In quis finibus turpis, non fringilla odio.";

const AUTHORS = "Lorem Ipsum";
const FILECOVER = "Donec quis";

const generateTitle = () => TITLES[Math.floor(Math.random() * TITLES.length)];

const generateData = () => {
  const data = [];

  for (let i = 1; i < 6; i++) {
    const title = generateTitle();

    let fileName,
      fileBook = "";

    try {
      fileName = `${title.replace(/\s/g, "-")}-${nanoid()}.txt`;
      const filePath = path.join(__dirname, "public", "files", `${fileName}`);
      fileBook = path.join("public", "files", fileName);
      fs.writeFileSync(filePath, "Тест!");
    } catch (err) {
      console.log(err);
    }

    const el = new Book(
      title,
      DESCRIPTION,
      AUTHORS,
      i,
      FILECOVER,
      fileName,
      fileBook
    );
    data.push(el);
  }

  return data;
};

module.exports = generateData;
