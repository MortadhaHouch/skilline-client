export default async function fetchData(
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    body: Record<string, unknown>|FormData | null,
    auth: string | "",
    contentType: "json" | "formData" | "",
    expectedContentType: "json" | "blob" | "formData" | "",
    files?: File[]
) {
    let requestBody: BodyInit | null = null;
    const requestHeaders: HeadersInit = {};
    if (auth) requestHeaders["Set-Cookie"] = auth;
    switch (method) {
        case "GET":
        case "DELETE":
            requestBody = null;
            break;
        case "POST":
        case "PUT":
            if (contentType === "json") {
                requestBody = JSON.stringify(body);
                requestHeaders["Content-Type"] = "application/json";
            } else if (contentType === "formData") {
                const formData = new FormData();
                if (body) {
                    Object.entries(body).forEach(([key, value]) => {
                        if (Array.isArray(value)) {
                            value.forEach(item => formData.append(key, item as string | Blob));
                        } else if (value instanceof File) {
                            formData.append(key, value);
                        } else {
                            formData.append(key, JSON.stringify(value));
                        }
                    });
                }
                if (files) {
                    files.forEach(file => formData.append("files", file));
                }

                requestBody = formData;
            }
            break;
    }

    try {
        const response = await fetch(`${import.meta.env.VITE_PUBLIC_REQUEST_URL}${url}`, {
            method,
            headers: requestHeaders,
            body: requestBody,
            credentials: "include",
        });
        switch (expectedContentType) {
            case "json":
                return await response.json();
            case "blob":
                return await response.blob();
            case "formData":{
                const formData = await response.formData();
                return {
                    file: formData.get("file"),
                    additionalData: JSON.parse(formData.get("data") as string),
                };
            }
            default:
                return response;
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        throw error;
    }
}