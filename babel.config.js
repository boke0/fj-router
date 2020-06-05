const plugins = [
    "@babel/proposal-class-properties",
    [
        "@babel/proposal-decorators",
        {
            decoratorsBeforeExport: true
        }
    ]
];

module.exports = {
    plugins
}
