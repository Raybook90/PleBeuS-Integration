const crypto = require('crypto');

module.exports.violationsExtractor = (sheets, minTemp, maxTemp) => {
    let violationsAmount = 0;
    const violations = [];
    sheets.forEach((sheet) => {
        const violationDataForSheet = {
            size: 0,
            data: [],
            sizeString: 0,
            dataString: '',
            dataHash: '',
        };
        sheet.data.forEach((row) => {
            const violationData = row.filter(temp => temp > maxTemp || temp < minTemp);
            violationsAmount = violationsAmount + violationData.length;
            violationData.forEach((temp) => {
                violationDataForSheet.size = violationDataForSheet.size + Buffer.byteLength(temp.toString(), 'utf8');
            });
            violationDataForSheet.data.push(...violationData);
        });
        if (violationDataForSheet.data && violationDataForSheet.data.length !== 0) {
            violationDataForSheet.dataString = violationDataForSheet.data.join();
            violationDataForSheet.sizeString = Buffer.byteLength(violationDataForSheet.dataString, 'utf8');
            violationDataForSheet.dataHash = crypto.createHash('sha256').update(violationDataForSheet.dataString).digest('hex');
            violations.push(violationDataForSheet)
        }
    });

    return {violationsAmount, violations}
};

module.exports.prepareStringData = (string) => {
    return {
        sizeString: Buffer.byteLength(string, 'utf8'),
        dataString: string,
        dataHash: crypto.createHash('sha256').update(string).digest('hex'),
    };
};