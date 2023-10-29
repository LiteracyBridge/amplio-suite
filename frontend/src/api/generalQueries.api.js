import { useAccountStore } from "@/store/account";
import { API_URL } from "@/models/constants";
// import Papa from 'papaparse';

// const GET_PROGRAMS_URL =
// "https://uomgzti07c.execute-api.us-west-2.amazonaws.com/prod";
// cons/programs= "/getPrograms";
const URL = "https://l0im73yun2.execute-api.us-west-2.amazonaws.com/prod";
const SUPPORTED_LANGUAGES = "/supported_languages";
const SUPPORTED_CATEGORIES = "/supported_categories";
const GET_ROADMAP = "/get_roadmap";
const PUT_ROADMAP = "/put_roadmap";
const STATUS = "/status";

function makeInit(params) {
    params = params || {};
    const method = params.method || "GET";
    const data = params.data || undefined;
    const fileData = params.fileData || undefined;
    let init = {
        method: method,
        cache: "no-cache",
        headers: { Authorization: useAccountStore().user.token }
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

async function getPrograms() {
    const init = makeInit();
    const fetch_response = await fetch(`${API_URL}/programs`, init);
    return fetch_response.json();
}

async function getLanguages(programId = null) {
    const init = makeInit();
    let url = `${URL}${SUPPORTED_LANGUAGES}`;
    if (programId) {
        url += `?programid=${programId}`;
    }
    const fetch_response = await fetch(url, init);
    let result = await fetch_response.json();
    console.log(result);
    console.log(programId);
    return result;
}

const getRoadmap = async programid => {
    const init = makeInit();
    let url = `${URL}${GET_ROADMAP}`;
    if (programid) {
        url += `?programid=${programid}`;
    }
    const fetch_response = await fetch(url, init);
    let result = fetch_response.json();
    return result;
};

const putRoadmap = async (programid, completed) => {
    const init = makeInit({ method: "PUT", data: completed });
    let url = `${URL}${PUT_ROADMAP}`;
    if (programid) {
        url += `?programid=${programid}`;
    }
    const fetch_response = await fetch(url, init);
    let result = fetch_response.json();
    return result;
};

async function getCategories(programid) {
    const init = makeInit();
    let url = `${URL}${SUPPORTED_CATEGORIES}`;
    if (programid) {
        url += `?programid=${programid}`;
    }
    const fetch_response = await fetch(url, init);
    let result = fetch_response.json();
    return result;
}

const getTbStatusBy = async (programid, selector) => {
    const init = makeInit();
    let url = `${URL}${STATUS}?selector=${selector}&programid=${programid}`;
    const fetch_promise = fetch(url, init);
    const fetch_response = await fetch_promise;
    let result = await fetch_response.json();
    return result;
};

export {
    getPrograms,
    getLanguages,
    getCategories,
    getRoadmap,
    putRoadmap,
    getTbStatusBy
};
