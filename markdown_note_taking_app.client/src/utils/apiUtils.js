/**
 * Saves the new file to the database
 * @param {string} fileName - The title to save
 * @param {Function} onSuccess - Callback function called on successful save
 * @param {Function} onError - Callback function called on error (optional)
 * @returns {Promise} - the fetch promise
 */
export const handleFileCreate = async (fileName, onSuccess, onError = null) => {
    try {
        const formData = new FormData();
        const emptyFile = new Blob([], { type: 'text/markdown' });
        formData.append("markDownFile", emptyFile, `${fileName}.md`);

        //Upload file to API
        const json_response = await uploadFileToApi(formData);
        if (json_response) {
            onSuccess(json_response.id, json_response.title);
        }
        else {
            if (onError) onError();
        }
    } catch (error) {
        console.error("Error creating file:", error);
        if (onError) onError();
    }
};

/**
 * Saves the new uploaded file to the database
 * @param {File} file - The file to upload (.md)
 * @param {Function} onSuccess - Callback function called on successful save
 * @param {Function} onError - Callback function called on error (optional)
 * @returns {Promise} - the fetch promise
 */
export const handleFileUpload = async (file, onSuccess, onError = null) => {
    try {
        if (file.name.toLowerCase().endsWith(".md")) {
            //Prepare the file for upload
            const formData = new FormData();
            formData.append("markDownFile", file)

            //Upload file to API
            const json_response = await uploadFileToApi(formData);
            if (json_response) {
                onSuccess(json_response.id, json_response.title);
            }
            else {
                if (onError) onError();
            }
        }
    } catch (error) {
        console.error("Error creating file:", error);
        if (onError) onError();
    }
    
};

//Helper function for post request in uploading the file to the database
async function uploadFileToApi(body) {
    try {
        const response = await fetch('https://localhost:7271/api/markdown', {
            method: 'POST',
            body: body,
        })

        if (response.ok) {
            console.log("File uploaded successfully.");
            const data = await response.json();
            return data;
        }
        else {
            console.error("Failed to upload the file.");
            alert("Failed to upload the file.");
            return null;
        }
    } catch (error) {
        console.error("Network error during upload:", error);
        alert("Network error during upload. Please try again.");
        return null;
    }
};


/**
 * Saves the new file name to the database
 * @param {string} fileId - The file GUID
 * @param {string} fileName - The file name to save
 * @param {Function} onSuccess - Callback function called on successful save
 * @param {Function} onError - Callback function called on error (optional)
 * @returns {Promise} - the fetch promise
 */
export const handleFileNameSave = async (fileId, fileName, onSuccess, onError = null) => {
    try {
        const patchDocument = [
            {
                "op": "replace",
                "path": "/title",
                "value": fileName
            }
        ];

        const response = await fetch(`https://localhost:7271/api/markdown/${fileId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json-patch+json'
            },
            body: JSON.stringify(patchDocument)
        })
        if (response.ok) {
            console.log("Successfully renamed file title to the database.");
            if (onSuccess) onSuccess();
            return response;
        }
        else {
            console.error("Failed to rename the file title");
            if (onError) onError();
            else alert("Failed to rename the file title");
            throw new Error("Failed to rename the file title");
        }
    } catch (error) {
        console.error("Error in file rename operation:", error);
        if (onError) onError();
        throw error;
    }
};

/**
 * Saves the new file content to the database
 * @param {string} fileId - The file GUID
 * @param {string} fileContent - The file content to save
 * @param {Function} onSuccess - Callback function called on successful save
 * @param {Function} onError - Callback function called on error (optional)
 * @returns {Promise<void>} - the fetch promise
 */
export const handleFileContentSave = async (fileId, fileContent, onSuccess, onError = null) => {
    try {
        const patchDocument = [
            {
                "op": "replace",
                "path": "/fileContent",
                "value": fileContent
            }
        ];

        const response = await fetch(`https://localhost:7271/api/markdown/${fileId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json-patch+json'
            },
            body: JSON.stringify(patchDocument)
        })
        if (response.ok) {
            console.log("Successfully saved the file to the database.");
            if (onSuccess) onSuccess()
        }
        else {
            console.error("Failed to save the file");
            if (onError) onError();
            alert("Failed to save the file");
        }
    } catch (error) {
        console.error("Error saving file content:", error);
        if (onError) onError();
    }
}

/**
 * Deletes the selected file to the database
 * @param {string} fileid - The title to save
 * @param {Function} onSuccess - Callback function called on successful save
 * @param {Function} onError - Callback function called on error (optional)
 * @returns {Promise} - the fetch promise
 */
export const handleFileDelete = async (fileId, onSuccess, onError = null) => {
    try {
        const response = await fetch(`https://localhost:7271/api/markdown/${fileId}`, {
            method: 'DELETE'
        })

        if (response.ok) {
            console.log("File deleted successfully")
            if (onSuccess) onSuccess();
        }
        else {
            if (onError) onError();
            console.error("Failed to delete file:");
            alert("Failed to delete the file");
        }
    } catch (error) {
        console.error("Error deleting the file:", error);
        if (onError) onError();
    }
};