import {randomUUID} from "node:crypto";
import {EMAIL_DOMAIN, EMAIL_PREFIX} from "./constants";

export function generateRandomUUIDEmail() {
    const uuid = randomUUID();
    return EMAIL_PREFIX + uuid + EMAIL_DOMAIN;
}
