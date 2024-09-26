import { API_URL } from "@/models/constants";
import { useAccountStore } from "@/store/account";
import axios from "axios";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class ApiRequest {
  static async get<T>(path: string): Promise<T[] | null> {
    return axios
      .get(`${API_URL}/${path}`, {
        headers: {
          Authorization: `Bearer ${useAccountStore().user.token}`,
        },
      })
      .then((response) => {
        return response.data.data as T[];
      })
      .catch((error) => {
        throw new Error(error.response.data.message);
      });
  }

  static async delete<T>(path: string): Promise<T[] | null> {
    return axios
      .delete(`${API_URL}/${path}`, {
        headers: {
          Authorization: `Bearer ${useAccountStore().user.token}`,
        },
      })
      .then((response) => {
        return response.data.data as T[];
      })
      .catch((error) => {
        throw new Error(error.response.data.message);
      });
  }

  static async post<T>(path: string, body: T | any): Promise<T[] | null> {
    return axios
      .post(`${API_URL}/${path}`, body, {
        headers: {
          Authorization: `Bearer ${useAccountStore().user.token}`,
        },
      })
      .then((response) => {
        return response.data.data as T[];
      })
      .catch((error) => {
        throw new Error(error.response.data.message);
      });
  }

  static async put<T>(path: string, body: T | any): Promise<T[] | null> {
    return axios
      .put(`${API_URL}/${path}`, body, {
        headers: {
          Authorization: `Bearer ${useAccountStore().user.token}`,
        },
      })
      .then((response) => {
        return response.data.data as T[];
      })
      .catch((error) => {
        throw new Error(error.response.data.message);
      });
  }
}
