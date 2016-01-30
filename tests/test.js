var Detector = require("../index")
    , path = require("path")
    ;

var detector = new Detector();

var test_data = [
    {url: "images/not-bordered-1.jpg", isBordered: false, thickness: 2},
    {url: "images/not-bordered-3.jpg", isBordered: false, thickness: 2},
    {url: "images/bordered-2.png", isBordered: true, thickness: 2},
    {url: "images/bordered-1.jpg", isBordered: true, thickness: 2},
];


const thickness = 2;

test_data.forEach((testDef) => {
    detector
        .detect(path.resolve(testDef.url), testDef.thickness)
        .then((result) => {
            console.dir(testDef);
            var isExpectedResult = testDef.isBordered === result;
            console.log("detected border ?", result, "test ok ? ", (isExpectedResult ? "true" : "false"));
        })
    ;
});