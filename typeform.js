require("dotenv").config();
const { createClient } = require("@typeform/api-client");

const date = new Date();
const typeformAPI = createClient({ token: process.env.TYPEFORM_TOKEN });

const uploadGifToTypeform = async (url) => {
  try {
    return await typeformAPI.images.add({ url });
  } catch (error) {
    return;
  }
};

const mapGifToChoice = async ({ gif, user, title }, idx) => {
  const image = await uploadGifToTypeform(gif);
  if (image) {
    return {
      ref: `choice-${idx + 1}`,
      label: `${title} by @${user}`,
      attachment: {
        type: "image",
        href: image.src,
      },
    };
  }
  return;
};

const mapGifToChoices = async (gifsList) => {
  return (await Promise.all(gifsList.map(mapGifToChoice))).filter(
    (choice) => choice
  );
};

exports.createForm = async function createForm(gifsList) {
  const choices = await mapGifToChoices(gifsList);

  return typeformAPI.forms.create({
    data: {
      title: `Vote my gif ${date.getMonth() + 1}/${date.getFullYear()}`,
      workspace: { href: "https://api.typeform.com/workspaces/2RaL8p" },
      type: "form",
      theme: {
        href: "https://api.typeform.com/themes/HDNbwc",
      },
      welcome_screens: [
        {
          ref: "WelcomeToVoteMyGif",
          title: "Time to find out which was this month's best gif",
          properties: {
            show_button: true,
            button_text: "Start",
            description: "Choose wisely",
          },
          attachment: {
            type: "image",
            href: "https://images.typeform.com/images/r9LJtdjty4Wt",
            properties: { description: "Abacum gif" },
          },
        },
      ],
      fields: [
        {
          ref: "gifs-selection",
          title: "*Pick your favourite gifs*",
          type: "picture_choice",
          validations: { required: true, min_selection: 5, max_selection: 5 },
          properties: {
            allow_multiple_selection: true,
            allow_other_choice: false,
            choices,
            randomize: true,
            show_labels: true,
            supersized: true,
          },
        },
      ],
      settings: {
        is_public: true,
      },
    },
  });
};
