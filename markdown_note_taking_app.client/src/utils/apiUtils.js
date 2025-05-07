/**
 * Saves the new file title to the database
 * @param {string} fileId - The file GUID
 * @param {string} fileTitle - The title to save
 * @param {Function} onSuccess - Callback function called on successful save
 * @param {Function} onError - Callback function called on error (optional)
 * @returns {Promise} - the fetch promise
 */
export const handleFileNameSave = (fileId, title, onSuccess, onError = null) => {
    const patchDocument = [
        {
            "op": "replace",
            "path": "/title",
            "value": title
        }
    ];

    return fetch(`https://localhost:7271/api/markdown/${fileId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json-patch+json'
        },
        body: JSON.stringify(patchDocument)
    })
        .then(response => {
            if (response.ok) {
                console.log("Successfully renamed file title to the database.");
                if (onSuccess) onSuccess();
                return response;
            } else {
                console.error("Failed to rename the file title");
                if (onError) onError();
                else alert("Failed to rename the file title");
                throw new Error("Failed to rename the file title");
            }
        });
};