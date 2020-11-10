require("dotenv").config();
const { createClient } = require("@typeform/api-client");

const date = new Date();
const typeformAPI = createClient({ token: process.env.TYPEFORM_TOKEN });

const uploadGifToTypeform = async (gif) => {
  try {
    const image = await typeformAPI.images.add({ url: gif });
    return image;
  } catch (error) {
    return;
  }
};

const mapGifToChoice = async (gif, idx) => {
  const image = await uploadGifToTypeform(gif);
  if (image) {
    return {
      ref: `choice-${idx + 1}`,
      label: `Choice ${idx + 1}`,
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

async function createForm(gifsList) {
  const choices = await mapGifToChoices(gifsList);

  await typeformAPI.forms.create({
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
}

const gifsList = [
  "https://media.giphy.com/media/xUVnVIzO42cGu8MHDM/giphy.gif",
  "https://media.giphy.com/media/D12CsrRNv7gL6/giphy.gif",
  "https://media.giphy.com/media/JtLrtaN4VPoKXJRKGB/giphy.gif",
  "https://media.giphy.com/media/S6BLhq4ZOvIdN0WVEQ/giphy.gif",
  "https://media.giphy.com/media/xsATxBQfeKHCg/giphy-downsized.gif",
  "https://media.giphy.com/media/3o6Ztbq61SRnUYmRZm/giphy.gif",
  "https://media.giphy.com/media/1fm9a68tbJPVGmeidp/giphy.gif",
  "https://media.giphy.com/media/AeUcmWquAI8tW/giphy.gif",
  "https://media.giphy.com/media/3osxY9kuM2NGUfvThe/giphy.gif",
  "https://media.giphy.com/media/l0O9zqqWAdj5xULOU/giphy.gif",
  "https://media4.giphy.com/media/1bqWJ6PDfW5os/giphy.gif?cid=ecf05e479ui53ohls0fx8f865le6e53bt7s9mckd3y133ypn&rid=giphy.gif",
  "https://media.giphy.com/media/LPHXLKEOZw6T6/giphy.gif",
  "https://media.giphy.com/media/AYC0liRZ9LoVq/giphy-downsized.gif",
  "https://media.giphy.com/media/3o7btNa0RUYa5E7iiQ/giphy-downsized.gif",
  "https://media.giphy.com/media/z61f8iheeGlvq/giphy-downsized.gif",
  "https://media0.giphy.com/media/rE4Nl0NhfY9Qk/giphy.gif?cid=ecf05e470b0252fb89310f23e32f14ce0f55a2bb3b22a9c6&rid=giphy.gif",
  "https://media0.giphy.com/media/ZHn4xJj0hLZ0Q/giphy.gif?cid=ecf05e47q6ridmnsw978y8vr0ue5lakkd4e7hplfuljty0i5&rid=giphy.gif",
  "https://media2.giphy.com/media/wJoDQt3uMfXW0/giphy.gif?cid=ecf05e470242y0cqsh5l2ainhl8kgp9nvwciymwwso00b4ow&rid=giphy.gif",
  "https://media3.giphy.com/media/xT5LML4FY3If24Bf0I/giphy.gif?cid=ecf05e47bqsy5c2plb8ydezdrqa39o4sfn98drh8bvfofsvp&rid=giphy.gif",
  "https://media2.giphy.com/media/ZtB2l3jHiJsFa/giphy.gif?cid=ecf05e47c7171e2f29e5286b6066797f70ac9c8db7f44e55&rid=giphy.gif",
  "https://media2.giphy.com/media/3xz2BQKaaGqHPydLhe/giphy.gif?cid=ecf05e47xchjgs52c3nvel8g9u80w16tuji2e7sdnxevkofw&rid=giphy.gif",
  "https://media.giphy.com/media/ULSkhG8VfnUt2/giphy.gif",
  "https://media0.giphy.com/media/xUySTEJYS5F1Cayg92/giphy.gif?cid=ecf05e47fc99b1cb4b2a8f10b3b280d018a75291488b5273&rid=giphy.gif",
  "https://media2.giphy.com/media/XQKBuQmfjt1xm/giphy.gif?cid=ecf05e4745e890014d51436e877c18ce0cc4e1e68fc53e9f&rid=giphy.gif",
  "https://media.giphy.com/media/RJhasN5Konz6an51Vs/giphy.gif",
  "https://media2.giphy.com/media/eiFPun3iDz8AiLSC0I/giphy.gif?cid=ecf05e47y7paut2cvq2hztb1imutitbrhikk08cen80t1j50&rid=giphy.gif",
  "https://media2.giphy.com/media/Wsju5zAb5kcOfxJV9i/giphy.gif?cid=ecf05e47h43gq3raypqljh1ead2yk5trxpxb0y4kef8cvodx&rid=giphy.gif",
  "https://media.giphy.com/media/VKWax7JlQsily/giphy.gif",
  "https://media.giphy.com/media/Is1O1TWV0LEJi/giphy.gif",
  "https://media0.giphy.com/media/P1PemPnyp4g1i/giphy.gif?cid=ecf05e471kney6z4xlnw7uh9k9ckd9n0r7dhq01uifzuz9k5&rid=giphy.gif",
  "https://media.giphy.com/media/5wM8H1HyU76j6/giphy.gif",
  "https://media.giphy.com/media/HX3lSnGXZnaWk/giphy.gif",
  "https://media.giphy.com/media/U29RXe9NC8RLSPeJfk/giphy.gif",
];

createForm(gifsList);
