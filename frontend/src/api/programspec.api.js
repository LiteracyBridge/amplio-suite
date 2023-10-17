// import store from "@/store";
import { useAccountStore } from "@/store/account";

// const URL2 = 'https://ng02lptr62.execute-api.us-west-2.amazonaws.com/Prod'
const URL2 = import.meta.env.VITE_APP_API_URL;
const URL = "https://v853rt57t9.execute-api.us-west-2.amazonaws.com/Prod";
const PUBLISH = "/publish";
// const GET_CONTENT = '/get_content'
// const PUT_CONTENT = "/put_content";
const DOWNLOAD = "/download";

function makeInit(params) {
    params = params || {};
    const method = params.method || "GET";
    const data = params.data || undefined;
    const fileData = params.fileData || undefined;
    let init = {
        method: method,
        cache: "no-cache",
        headers: { Authorization:  useAccountStore().user.token.jwtToken }
    };
    if (data) {
        init.body = JSON.stringify(data);
        init.headers["Content-Type"] = "application/json";
    } else if (fileData) {
        init.body = fileData;
        //init.headers['Content-Type'] = 'application/text';
    }
    return init;
}

async function publish(programid) {
    const init = makeInit();
    const fetch_response = await fetch(
        `${URL}${PUBLISH}?programid=${programid}`,
        init
    );
    return fetch_response.json();
}

/**
 * Uses the new, still experimental, program specification reader/writer.
 * @param programid
 * @returns {Promise<any>}
 */
async function getProgramSpec(programid) {
    const init = makeInit();
    const fetch_response = await fetch(
        `${URL2}/program-spec/content?programid=${programid}`,
        init
    );
    return fetch_response.json();
}

async function putProgramSpec(programid, programspec) {
    const init = makeInit({ method: "PUT", data: programspec });
    const fetch_response = await fetch(
        `${URL2}/program-spec/content?programid=${programid}`,
        init
    );
    return fetch_response.json();
}

async function getDownloadLink(programid, artifact) {
    const init = makeInit();
    const fetch_response = await fetch(
        `${URL}${DOWNLOAD}?programid=${programid}&aslink=true&artifact=${artifact}`,
        init
    );
    return fetch_response.json();
}

async function uploadSpec(programid, fileData) {
    const init = makeInit({ method: "POST", fileData: fileData });
    const fetch_request = new Request(
        `${URL}/upload?programid=${programid}&return_diff=t`,
        init
    );
    const fetch_response = await fetch(fetch_request);
    return fetch_response.json();
}

async function approveSpec(programid, publish) {
    const init = makeInit({ method: "GET" });
    const fetch_request = new Request(
        `${URL}/accept?programid=${programid}&publish=${publish ? "t" : "f"}`,
        init
    );
    const fetch_response = await fetch(fetch_request);
    return fetch_response.json();
}

export {
    publish,
    getProgramSpec,
    putProgramSpec,
    // getContent,
    // getContent2,
    // putContent,
    getDownloadLink,
    uploadSpec,
    approveSpec
};
