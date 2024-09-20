const paginate = async (data, pageSize, pageNumber) => {
    // Check if data is an array
    if (Array.isArray(data)) {
        const startIndex = (pageNumber - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        // Return an empty array if data length is less than startIndex
        if (startIndex >= data.length) {
            return [];
        }
        return data.slice(startIndex, endIndex);
    }
};

export {paginate}