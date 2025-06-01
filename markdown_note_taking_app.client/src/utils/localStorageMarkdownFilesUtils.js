import { createLogger } from '../logger/logger.js';

const LOCAL_FILES_KEY = 'local_markdown_files';

const logger = createLogger('localStorage');

/**
 * Save a file to local storage
 * @param {Object} fileObject - File object with title, content, etc.
 * @returns {Object} Saved file with generated id
 */
export const saveLocalFile = (fileObject) => {
    const filesJson = localStorage.getItem(LOCAL_FILES_KEY);
    const files = filesJson ? JSON.parse(filesJson) : [];
    

    // Generate a local ID if none exists
    const fileToSave = {
        ...fileObject,
        guid: fileObject.guid || `local-${Date.now()}`,
        uploadDate: new Date().toISOString()
    };

    // Update existing or add new
    const existingIndex = files.findIndex(f => f.guid === fileToSave.guid);
    if (existingIndex >= 0) {
        files[existingIndex] = fileToSave;
    } else {
        files.push(fileToSave);
    }

    // Save the updated files array back to localStorage
    localStorage.setItem(LOCAL_FILES_KEY, JSON.stringify(files));
    logger.info('File saved', { fileName: fileObject.title });
    return fileToSave;
}

/**
 * Upload a .md file to local storage
 * @param {File} - The file to upload (.md)
 */
export const uploadLocalFile = async (file) => {
    if (!file || !file.name.toLowerCase().endsWith('.md')) {
        logger.error("Invalid file or not a markdown file");
    }

    try {
        const fileContent = await file.text();

        const fileName = file.name.replace(/\.md$/i, '');

        const fileObject = {
            title: fileName,
            fileContent: fileContent
        };

        const savedFile = saveLocalFile(fileObject);
        logger.info('File uploaded successfully', savedFile);
        return savedFile;
    } catch (error) {
        logger.error("Error reading file", error);
        throw error;
    }
    
}

/**
 * Get all locally stored files
 * @returns {Array} Array of file objects
 */
export const getLocalFiles = () => {
    const files = localStorage.getItem(LOCAL_FILES_KEY);
    logger.info('Successfully got the local files');
    return files ? JSON.parse(files) : [generateWelcomeFile()];
};

/**
 * Get a specific file from local storage
 * @param {string} fileId - ID of the file to retrieve
 * @returns {Object|null} File object or null if not found
 */
export const getLocalFile = (fileId) => {
    const files = getLocalFiles();
    logger.info('Successfully got the local file');
    return files.find(f => f.guid === fileId) || null;
};

/**
 * Handles file renames in local storage
 * @param {string} fileId - ID of the file to retrieve
 * @param {string} fileName - The new file name to be edited
 */
export const updateLocalFileName = (fileId, fileName) => {
    const filesJson = localStorage.getItem(LOCAL_FILES_KEY);
    const files = filesJson ? JSON.parse(filesJson) : [];

    const fileIndex = files.findIndex(f => f.guid === fileId);

    files[fileIndex].title = fileName;
    // Save the updated files array back to localStorage
    localStorage.setItem(LOCAL_FILES_KEY, JSON.stringify(files));
    logger.info('Successfully renamed file: ', fileId);

};

/**
 * Delete a file from local storage
 * @param {string} fileId - ID of the file to delete
 * @returns {boolean} True if deletion was successful
 */
export const deleteLocalFile = (fileId) => {
    const files = getLocalFiles();
    const newFiles = files.filter(file => file.guid !== fileId);
    localStorage.setItem(LOCAL_FILES_KEY, JSON.stringify(newFiles));
    logger.info('Successfully deleted the file');
    return true;
}

/**
 * Helper function for generating the default welcome file
 * @returns{Object} Returns the welcome file object (Without guid and upload date)
 */
const generateWelcomeFile = () => {
    const welcomeFile = {
        title: 'Welcome_File',
        fileContent: "# Welcome to Your Markdown Note Taking App\n\n" +
            "This is a sample markdown file to get you started.\n\n" +
            "## Features\n\n" +
            "- Create and edit markdown files\n" +
            "- Save your notes in the cloud\n" +
            "- Collaborate with others\n\n" +
            "## Markdown Syntax\n\n" +
            "You can use various markdown syntax elements:\n\n" +
            "**Bold text** or *italic text*\n\n" +
            "- Bulleted lists\n" +
            "- Like this one\n\n" +
            "1. Numbered lists\n" +
            "2. Are also supported\n\n" +
            "```\n" +
            "Code blocks too!\n" +
            "```\n\n" +
            "Enjoy writing!"
    };

    saveLocalFile(welcomeFile);
    logger.info('Generated the welcome file');
    return welcomeFile;
};

// TODO: Files migration to cloud
// Make sure that it uploads in files
// Also make sure that if welcome file exists in cloud database dont upload it