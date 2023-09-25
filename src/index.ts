import { registerPlugin, ChecklistElement } from "@pexip/plugin-api";
import { roomDirectory } from "./rooms";

let feccListOptions: ChecklistElement["options"];
let directorylistOptions = roomDirectory;

//SVG Icons
const directoryIconSVG =
  '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M96 0C60.7 0 32 28.7 32 64V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H96zM208 288h64c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16H144c-8.8 0-16-7.2-16-16c0-44.2 35.8-80 80-80zm-32-96a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zM512 80c0-8.8-7.2-16-16-16s-16 7.2-16 16v64c0 8.8 7.2 16 16 16s16-7.2 16-16V80zM496 192c-8.8 0-16 7.2-16 16v64c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm16 144c0-8.8-7.2-16-16-16s-16 7.2-16 16v64c0 8.8 7.2 16 16 16s16-7.2 16-16V336z" fill="white"/></svg>';

const directoryHoverIconSVG =
  '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M96 0C60.7 0 32 28.7 32 64V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H96zM208 288h64c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16H144c-8.8 0-16-7.2-16-16c0-44.2 35.8-80 80-80zm-32-96a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zM512 80c0-8.8-7.2-16-16-16s-16 7.2-16 16v64c0 8.8 7.2 16 16 16s16-7.2 16-16V80zM496 192c-8.8 0-16 7.2-16 16v64c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm16 144c0-8.8-7.2-16-16-16s-16 7.2-16 16v64c0 8.8 7.2 16 16 16s16-7.2 16-16V336z" fill="black"/></svg>';

const plugin = await registerPlugin({
  id: "room-directory-plugin",
  version: 1.0,
});

const directory_Button = await plugin.ui
  .addButton({
    position: "toolbar",
    icon: {
      custom: { main: directoryIconSVG, hover: directoryHoverIconSVG },
    },
    tooltip: "Room Directory",
    roles: ["chair"],
  })
  .catch((e) => {
    console.warn(e);
  });

directory_Button?.onClick.add(async () => {
  const input = await plugin.ui.addForm({
    title: "Video Phonebook",
    description: "Select a video system to call.",
    form: {
      elements: {
        directoryList: {
          name: "",
          type: "select",
          options: roomDirectory.videoRooms,
        },
      },
      submitBtnTitle: "Call",
    },
  });

  input.onInput.add(async (formInput) => {
    const selectedRoom = formInput.directoryList;
    if (selectedRoom) {
      const dialout = await plugin.conference.dialOut({
        role: "GUEST",
        destination: selectedRoom,
        protocol: "auto",
      });
      plugin.ui.showToast({
        message: "📞 Calling " + selectedRoom,
      });
    }
    input.remove();
  });
});
