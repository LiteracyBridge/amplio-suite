import cognitoAuth from "@/cognito";
import { defineStore } from "pinia";

export const useAccountStore = defineStore("account", {
    state: () => ({
        status: "",
        user: {
            email: "",
            name: "",
            img: "",
            token: ""
        },
        signUp: {
            send: false,
            email: ""
        }
    }),

    getters: {},

    //   mutations: {
    //     authRequest(state){
    //       state.status = 'loading'
    //     },
    //     authSuccess(state){
    //       state.status = 'success'
    //     },
    //     authError(state){
    //       state.status = 'error'
    //     },
    //     setUser(state, payload) {
    //       state.user = payload
    //     },
    //     setSignUp(state, payload) {
    //       state.signUp.send = true
    //       state.signUp.email = payload
    //     },
    //     clearSignUp(state) {
    //       state.signUp.send = false
    //       state.signUp.email = ''
    //     }
    //   },

    actions: {
        authRequest() {
            this.status = "loading";
        },
        authSuccess() {
            this.status = "success";
        },
        authError() {
            this.status = "error";
        },
        setUser(payload: any) {
            this.user = payload;
        },
        setSignUp(email: string) {
            this.signUp.send = true;
            this.signUp.email = email;
        },
        clearSignUp() {
            this.signUp.send = false;
            this.signUp.email = "";
        },
        async login(payload: { email: string; token?: any; password: any }) {
            this.$state.status = "loading";

            if (this.signUp.send) {
                await cognitoAuth.confirmRegistration(
                    payload.email,
                    payload.token
                );
                this.clearSignUp();
                // commit("clearSignUp");
            }

            return new Promise((resolve, reject) => {
                cognitoAuth.authenticate(
                    payload.email,
                    payload.password,
                    (err: any, result: { getIdToken: () => any }) => {
                        if (err) {
                            this.authError();
                            // this.authError();
                            reject(err);
                        }

                        if (result) {
                            const token = result.getIdToken();
                            const user = {
                                email: payload.email,
                                name: payload.email.split("@")[0],
                                token: token.jwtToken
                            };

                            localStorage.setItem("user", JSON.stringify(user));

                            this.setUser(user);
                            this.authSuccess();
                            // commit("setUser", user);
                            // this.authSuccess();
                            resolve("success");
                        }
                    }
                );
            });
        },
        async register(payload: {
            fullName: string;
            email: string;
            emailConfirmation: string;
            password: string;
        }) {
            this.authRequest();

            return new Promise((resolve, reject) => {
                const isFill = [
                    payload.fullName !== "",
                    payload.email !== "",
                    payload.emailConfirmation !== "",
                    payload.password !== ""
                ].every(Boolean);

                if (!isFill) {
                    reject("Not fill");
                }

                cognitoAuth.signup(
                    payload.email,
                    payload.email,
                    payload.password,
                    (err: any, result: any) => {
                        if (err) {
                            this.authError();
                            reject(err);
                        }

                        if (result) {
                            this.authSuccess();
                            this.setSignUp(payload.email);
                            resolve("success");
                        }
                    }
                );
            });
        },
        async forgotPassword(payload: { user: any }) {
            this.authRequest();
            return new Promise((resolve, reject) => {
                cognitoAuth.forgotPassword(payload.user, (err: any) => {
                    if (err) {
                        this.authError();
                        reject(err);
                    } else {
                        this.authSuccess();
                        resolve("success");
                    }
                });
            });
        },
        async confirmNewPassword(payload: {
            user: any;
            resetToken: any;
            password: any;
        }) {
            this.authRequest();

            try {
                await cognitoAuth.confirmPassword(
                    payload.user,
                    payload.resetToken,
                    payload.password
                );
                this.authSuccess();
            } catch {
                this.authSuccess();
            }
        },
        async logout() {
            this.setUser({ email: "", name: "", img: "" });
            cognitoAuth.logout();
        },
        async requireAuth() {
            // Resolve if the user is authenticated
            // Else reject
            // if(this.user?.token !=null) return;

            const loadUser = () => {
                // Retrieve the object from storage
                const user = localStorage.getItem("user");

                this.setUser(JSON.parse(user));
            };

            return new Promise<void>((resolve, reject) => {
                cognitoAuth.isAuthenticated(
                    (tokenOrError: any, loggedIn: any) => {
                        if (!loggedIn) {
                            if (tokenOrError) {
                                loadUser();
                                resolve();
                            } else reject();
                        } else {
                            loadUser();
                            resolve();
                        }
                    }
                );
            });
        }
    }
});
