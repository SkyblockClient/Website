/* Populate the list of mods and texture packs */
Promise.all([
  fetch(
    "https://raw.githubusercontent.com/nacrt/SkyblockClient-REPO/main/files/mods.json"
  ),
  fetch(
    "https://raw.githubusercontent.com/nacrt/SkyblockClient-REPO/main/files/packs.json"
  ),
])
  .then(([modsResp, packsResp]) => {
    return Promise.all([modsResp.json(), packsResp.json()]);
  })
  .then(([mods, packs]) => {
    const transformer = (item, hosting) => {
      const guideAction = item?.actions?.find(
        (action) =>
          (action?.link || action?.document).includes("files/guides") ||
          action.text == "Guide"
      );
      return {
        name: item.display,
        id: item.id,
        description: item.description,
        icon:
          "https://raw.githubusercontent.com/nacrt/SkyblockClient-REPO/main/files/icons/" +
          item.icon,
        downloadLink: item?.url || hosting + item.file,
        downloadAs: item.file,
        bundledItems: item?.packages,
        bundledConfig: item?.files?.map((file) => ({
          path: file,
          hostPath: "mcdir/" + file,
        })),
        hide: item?.hidden,
        enabled: item?.enabled,
        guide: (guideAction?.link || guideAction?.document)
          ?.replace("?raw=true", "")
          ?.replace("REPO/main", "REPO/blob/main")
          ?.replace("raw.githubusercontent.com", "github.com")
          ?.concat("#readme"),
      };
    };
    window.listMods = mods.map((item) =>
      transformer(
        item,
        "https://raw.githubusercontent.com/nacrt/SkyblockClient-REPO/main/files/mods/"
      )
    );
    window.listPacks = packs.map((item) =>
      transformer(
        item,
        "https://raw.githubusercontent.com/nacrt/SkyblockClient-REPO/main/files/packs/"
      )
    );
    const renderItem = (item) => {
      if (item.hide) return;
      const itemElement = document.createElement("li");
      itemElement.title = item.description;
      itemElement.className = "whitespace-nowrap overflow-hidden text-ellipsis";
      itemElement.innerHTML = `
          <label>
            <input
              type="checkbox" class="checkbox" data-id="${item.id}"
              ${item.enabled ? "checked" : ""}>
            <img class="inline-block max-h-4" src="${item.icon}">
            ${
              item.guide
                ? `<a href="${item.guide}" target="_blank">
                  <img src="../assets/info.svg" class="inline-block max-h-4">
                </a>`
                : ""
            }
            <strong>${item.name}</strong> - ${item.description}
          </label>
        `;
      return itemElement;
    };
    for (const item of window.listMods) {
      const itemElement = renderItem(item);
      if (!itemElement) continue;
      document.getElementById("modSpace").appendChild(itemElement);
    }
    for (const item of window.listPacks) {
      const itemElement = renderItem(item);
      if (!itemElement) continue;
      document.getElementById("packSpace").appendChild(itemElement);
    }
  });

/* Directory chooser */
if (window.showDirectoryPicker) {
  document.querySelector("#unsupportedWarning").classList.add("hidden");
  document.querySelector("#dropSpace").addEventListener(
    "dragover",
    (e) => {
      e.preventDefault();
    },
    false
  );
  document.querySelector("#dropSpace").addEventListener("drop", async (e) => {
    e.preventDefault();
    const directory = e.dataTransfer.items[0];
    window.baseHandle = await directory.getAsFileSystemHandle();
    startInstall();
  });
  document.querySelector("#dropSpace").addEventListener("click", async () => {
    window.baseHandle = await window.showDirectoryPicker();
    startInstall();
  });
} else {
  document.querySelector("#dropSpace").classList.add("opacity-20");
  document.querySelector("#dropSpace").classList.add("cursor-not-allowed");
}

/* Launcher info for MultiMC */
[
  document.querySelector("#vanillaRadio"),
  document.querySelector("#multimcRadio"),
].forEach((element) => {
  element.addEventListener("change", () => {
    if (document.querySelector("#multimcRadio").checked) {
      document.querySelector("#launcherInfo").classList.remove("hidden");
      document.querySelector("#multimcFinishInfo").classList.remove("hidden");
      document.querySelector("#multimcFinishInfo").classList.add("inline-block");
      document.querySelector("#vanillaFinishInfo").classList.add("hidden");
    } else {
      document.querySelector("#launcherInfo").classList.add("hidden");
      document.querySelector("#multimcFinishInfo").classList.add("hidden");
      document.querySelector("#multimcFinishInfo").classList.remove("inline-block");
      document.querySelector("#vanillaFinishInfo").classList.remove("hidden");
    }
  });
});

/* Transition between screens */
document.querySelector("#loadingScreen").classList.remove("hidden");
setTimeout(() => {
  document.querySelector("#loadingScreen").classList.add("hidden");
  document.querySelector("#configScreen").classList.remove("hidden");
}, 1000);
const startInstall = () => {
  if (!window.baseHandle) {
    alert("Hol up... No directory selected!");
    return;
  }
  if (window.baseHandle.kind != "directory") {
    alert("Hol up... That's not a directory!");
    return;
  }
  if (window.baseHandle.name != ".minecraft") {
    alert("Hol up... That's not the .minecraft directory!");
    return;
  }
  document.querySelector("#configScreen").classList.add("hidden");
  document.querySelector("#warningScreen").classList.remove("hidden");
};
document.querySelector("#installButton").addEventListener("click", () => {
  document.querySelector("#warningScreen").classList.add("hidden");
  document.querySelector("#progressScreen").classList.remove("hidden");
  install();
});

/* Actually install */
const logToProgressLog = (message) => {
  const progressElement = document.querySelector("#progressLog");
  progressElement.innerHTML +=
    "<strong>" +
    new Date().toLocaleTimeString() +
    "</strong> - " +
    message.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") +
    "\n";
};
const writeFile = async (path, data) => {
  logToProgressLog(`Writing ${path}`);
  try {
    let currentContext = window.baseHandle;
    let remainingPath = path;
    while (remainingPath.length > 0) {
      if (remainingPath.includes("/")) {
        // if it's a directory, use .getDirectoryHandle(dir, { create: true })
        const dir = remainingPath.substring(0, remainingPath.indexOf("/"));
        currentContext = await currentContext.getDirectoryHandle(dir, { create: true });
        remainingPath = remainingPath.substring(remainingPath.indexOf("/") + 1);
      } else {
        // if it's a file, use .getFileHandle(file, { create: true })
        currentContext = await currentContext.getFileHandle(remainingPath, {
          create: true,
        });
        const writableFile = await currentContext.createWritable();
        await writableFile.write(data);
        await writableFile.close();
        return;
      }
    }
  } catch (e) {
    console.error(e);
    logToProgressLog(`Failed to write ${path}`);
    alert(
      "There was an error trying to write a file. Try closing and reopening the page, then browsing instead of using drag and drop."
    );
  }
};
const cachedAssets = [
  "DwarvenAssets v1.1.zip",
  "Autotip-3.0.1 [1.8-1.12.2].jar",
  "Dungeon_Rooms-3.3.1.jar",
  "BehindYouV3-3.0.0.jar",
  "Hytilities-Reborn-1.4.1.jar",
  "SBCustomMobTex-1.4.jar",
  "SimpleToggleSprint-2.2.0.jar",
  "ActuallyPacketsv0.1.zip",
  "ctjs-2.0.4-1.8.9.jar",
  "Blur-MC1.8.9-1.0.4-2.jar",
  "smooth-scrolling-everywhere-1.2.jar",
  "ActuallyAssets.v1.8.2.zip",
  "SkyblockClient-Cosmetics-BETA-7.0.6.jar",
  "Nick Hider-6.0 (1.8.9).jar",
  "Levelhead-8.1 (1.8.9).jar",
  "Hypixel+ 1.8.9.zip",
  "v13 16x Skyblock Pack.zip",
  "v13 32x Skyblock Pack.zip",
  "Keystrokes-8.1.2 (1.8.9).jar",
  "v2 Dark Skyblock UI.zip",
  "NotEnoughUpdates-2.0.0.jar",
  "Optibye-1.0.0-dep.jar",
  "Apec-1.10.1.jar",
  "RewardClaim-1.0.4.jar",
  "SkyblockClient-Updater-1.2.0.jar",
  "RNBW+ v0.7.0.zip",
  "Chatting-1.3.1.jar",
  "Insomnia-1.0-REL.jar",
  "DamageTint-3.2.0.jar",
  "Scrollable Tooltips-1.4 (1.8.9).jar",
  "HSB Texturepack V1.7.zip",
  "REDACTION-1.2.1.jar",
  "ActuallyMobsv0.1.zip",
  "ItemPhysic Lite 1.3.jar",
  "VanillaHUD-1.1.1.jar",
  "OptiFine_1.8.9_HD_U_M5.jar",
  "Synthesis-0.2.0.jar",
  "AutoGG-4.1.3 (1.8.9).jar",
  "DUNGEONS_TEXTURE_PACK_V1.2.zip",
  "CustomMainMenu-MC1.8.9-2.0.jar",
  "dungeonsguide-3.7.7.jar",
  "CrashPatch-1.3.6.jar",
  "Cowlection-1.8.9-0.14.0.jar",
  "OofMod-4.1.0.jar",
  "kios-hsb-pack.zip",
  "Craftify-1.0.0-beta-7.jar",
  "Dankers_Skyblock_Mod-1.8.7-beta4.jar",
  "Smoll_Icons.zip",
  "Hypixel Autocomplete-1.1 (1.8.9).jar",
  "ParticlesEnhanced-1.2.0.jar",
  "FurfSky Reborn OV [1.4.2].zip",
  "Compliment.zip",
  "SkyblockHud-1.13-beta7.jar",
  "Sound Subtitles-1.2.2 (1.8.9).jar",
  "SkyblockAddons-1.7.0-beta.37064-for-MC-1.8.9.jar",
  "SkyblockOverhaul-Overlay_32x-1.1.5.zip",
  "SkyMobs.zip",
  "itlt-1.8.8-9-1.0.1.jar",
  "ReportPlus-1.0.0.jar",
  "Block_Overlay_4.0.3.jar",
  "TNT Time-1.1 (1.8.9).jar",
  "Compliance-32x-1.8.9.zip",
  "Popup Events-1.3.2 (1.8.9).jar",
  "Mob Packet 1.8.9 1.4.zip",
  "Skytils-1.2.0-pre6.jar",
  "Resource_Pack_Manager_1.2.jar",
  "Patcher-1.8.1 (1.8.9).jar",
  "EvergreenHUD (1.8.9-1.4.0) (DOWNGRADE NOT A BUG).jar",
  "Worlds and Beyond [16x] - Release 1.5.zip",
  "xCynis Skyblock Pack - v3.0.zip",
  "TimeChanger-2.2.1.jar",
  "1.14 Packport.zip",
  "Nameless [Alpha 5].zip",
  "betterchat-1.5.jar",
  "1.8.9 SkyblockPersonalized 1.6.0.1.jar",
];
const downloadFile = async (url, fallbackName) => {
  if (cachedAssets.includes(fallbackName)) {
    const response = await fetch("../assetcache/" + fallbackName);
    const data = await response.arrayBuffer();
    return data;
  }
  try {
    const response = await fetch(url, {
      headers: { Accept: "application/octet-stream" },
    });
    const data = await response.arrayBuffer();
    return data;
  } catch (e) {
    try {
      if (!fallbackName) throw e;
      logToProgressLog("Using proxy due to CORS");
      const encodedName = encodeURIComponent(fallbackName);
      const encodedURL = encodeURIComponent(url.split("//")[1]);
      return await downloadFile(
        `https://cloudclient-proxy.ktibow.repl.co/mod?file=${encodedName}&url=${encodedURL}`
      );
    } catch (proxyE) {
      console.error(proxyE);
      alert(`There was an error trying to download ${url}.`);
      return;
    }
  }
};
const install = async () => {
  if (document.querySelector("#vanillaRadio").checked) {
    // Install Forge
    logToProgressLog("Downloading Forge");
    const forgeJar = await downloadFile(
      "https://raw.githubusercontent.com/nacrt/SkyblockClient-REPO/main/files/forge/forge-1.8.9-11.15.1.2318-1.8.9.jar"
    );
    const forgeJSON = await downloadFile(
      "https://raw.githubusercontent.com/nacrt/SkyblockClient-REPO/main/files/forge/1.8.9-forge1.8.9-11.15.1.2318-1.8.9.json"
    );
    await writeFile(
      "libraries/net/minecraftforge/forge/1.8.9-11.15.1.2318-1.8.9/forge-1.8.9-11.15.1.2318-1.8.9.jar",
      forgeJar
    );
    await writeFile(
      "versions/1.8.9-forge1.8.9-11.15.1.2318-1.8.9/1.8.9-forge1.8.9-11.15.1.2318-1.8.9.json",
      forgeJSON
    );
    window.dirHandle = await window.baseHandle.getDirectoryHandle("skyclient", {
      create: true,
    });
  } else {
    window.dirHandle = window.baseHandle;
  }
  const modBase = document.querySelector("#vanillaRadio").checked
    ? "skyclient/mods/"
    : "mods/";
  const packBase = document.querySelector("#vanillaRadio").checked
    ? "skyclient/resourcepacks/"
    : "resourcepacks/";
  const configBase = document.querySelector("#vanillaRadio").checked
    ? "skyclient/"
    : "";
  // Put the mods together, including dependencies
  const modList = [];
  for (const mod of window.listMods) {
    if (mod.hide) continue;
    if (!document.querySelector(`[data-id="${mod.id}"]`).checked) continue;
    modList.push({
      url: mod.downloadLink,
      name: mod.downloadAs,
      extras: mod.bundledConfig,
    });
    if (mod.bundledItems) {
      mod.bundledItems.forEach((id) => {
        const bundledMod = window.listMods.find((mod) => mod.id == id);
        modList.push({ url: bundledMod.downloadLink, name: bundledMod.downloadAs });
      });
    }
  }
  const packList = window.listPacks
    .filter((pack) => {
      if (pack.hide) return false;
      return document.querySelector(`[data-id="${pack.id}"]`).checked;
    })
    .map((pack) => ({ url: pack.downloadLink, name: pack.downloadAs }));
  // Download and install the assets
  const allTasks = [];
  modList.forEach((mod) => {
    allTasks.push(async () => {
      logToProgressLog(`Downloading **${mod.name}**`);
      const modFile = await downloadFile(mod.url, mod.name);
      await writeFile(modBase + mod.name, modFile);
    });
    if (mod.extras) {
      for (const { path, hostPath } of mod.extras) {
        allTasks.push(async () => {
          logToProgressLog(`Downloading ${path}`);
          const fileContent = await downloadFile(
            "https://raw.githubusercontent.com/nacrt/SkyblockClient-REPO/main/files/" +
              hostPath
          );
          await writeFile(configBase + path, fileContent);
        });
      }
    }
  });
  packList.forEach((pack) => {
    allTasks.push(async () => {
      logToProgressLog(`Downloading **${pack.name}**`);
      const packFile = await downloadFile(pack.url, pack.name);
      await writeFile(packBase + pack.name, packFile);
    });
  });
  await Promise.all(allTasks.map((task) => task()));
  // Finish up
  confetti({
    particleCount: 300,
    spread: 100,
    decay: 0.95,
    origin: { y: 1 },
  });
  document.querySelector("#progressScreen").classList.add("hidden");
  document.querySelector("#finishScreen").classList.remove("hidden");
};
