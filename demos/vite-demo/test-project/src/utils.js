const formatName = ({first, last}) => `${first} ${last}`;

const slowFormat = async ({first, last}) => {
    return `${first} ${last}`;
};

export {formatName, slowFormat};