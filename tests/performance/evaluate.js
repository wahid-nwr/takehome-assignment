import http from "k6/http";
import { check, sleep } from "k6";
import { Counter } from "k6/metrics";

const MAX_VUS = Number(__ENV.MAX_VUS || 20);

export const options = {
    scenarios: {
        evaluate: {
            executor: "ramping-vus",
            stages: [
                { duration: "10s", target: MAX_VUS }, // Ramp up
                { duration: "30s", target: MAX_VUS }, // Hold steady
                { duration: "10s", target: 0 },       // Ramp down
            ],
        },
    },

    thresholds: {
        http_req_failed: ["rate==0"],

        http_req_duration: [
            "avg<20",
            "p(95)<25",
            "p(99)<50",
        ],
    },
};

const BASE_URL =
    __ENV.BASE_URL || "http://localhost:3000";

const API_KEY =
    __ENV.API_KEY;

const successfulEvaluations = new Counter("successful_evaluations");

if (!API_KEY) {
    throw new Error(
        "API_KEY environment variable is required."
    );
}

export default function () {

    const countries = ["SG", "US", "UK", "DE"];

    const payload = JSON.stringify({
        environment: "PRODUCTION",
        userId: `user-${__VU}-${__ITER}`,
        context: {
            country: countries[Math.floor(Math.random() * countries.length)],
        },
    });

    const params = {
        headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
        },
    };

    const response = http.post(
        `${BASE_URL}/api/v1/evaluate`,
        payload,
        params
    );

    if (response.status === 200) {
        successfulEvaluations.add(1);
    }

    check(response, {
        "status is 200": (r) => r.status === 200,
    });

    sleep(1);
}