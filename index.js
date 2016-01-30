var GetPixels = require("get-pixels")
    , range = require("node-range")
    , color2hex = require("colorhex").color2hex
    , colorDiff = require("color-difference")
    ;

function BorderDetector() {

}

BorderDetector.prototype.GetPixelsOfBorder = function (pixels, thicknessPixels) {
    return new Promise((resolve, reject) => {
        var width = pixels.shape[0]
            , height = pixels.shape[1]
            , colorInf = pixels.shape[2]
            ;

        var pixels_of_border = [];

        var thickRange = range(0, thicknessPixels)
            , widthRange = range(0, width - 1)
            , heightRange = range(0, height - 1)
            , colorsRange = range(0, colorInf - 1)
            ;

        // fetch width with y = 0 (top)
        thickRange.forEach((thickerPos) => {
            widthRange.forEach((widthPos) => {
                var width_occurence = thickerPos + widthPos;
                var height_occurence = 0;

                var pixel = colorsRange.map((colorPos) => {
                    return pixels.get(width_occurence, height_occurence, colorPos);
                });

                var hex = color2hex(pixel);
                if (hex.indexOf("NaN") > -1) return;

                pixels_of_border.push(hex);
            });
        });

        // fetch width with y = height (bottom)
        thickRange.forEach((thickerPos) => {
            widthRange.forEach((widthPos) => {
                var width_occurence = thickerPos + widthPos;
                var height_occurence = height;

                var pixel = colorsRange.map((colorPos) => {
                    return pixels.get(width_occurence, height_occurence, colorPos);
                });

                var hex = color2hex(pixel);
                if (hex.indexOf("NaN") > -1) return;

                pixels_of_border.push(hex);
            });
        });

        // fetch height with x = 0 (left)
        thickRange.forEach((thickerPos) => {
            heightRange.forEach((heightPos) => {
                var width_occurence = 0;
                var height_occurence = thickerPos + heightPos;

                var pixel = colorsRange.map((colorPos) => {
                    return pixels.get(width_occurence, height_occurence, colorPos);
                });

                var hex = color2hex(pixel);
                if (hex.indexOf("NaN") > -1) return;

                pixels_of_border.push(hex);
            })
        });

        // fetch height with x = 0 (right)
        thickRange.forEach((thickerPos) => {
            heightRange.forEach((heightPos) => {
                var width_occurence = width;
                var height_occurence = thickerPos + heightPos;

                var pixel = colorsRange.map((colorPos) => {
                    return pixels.get(width_occurence, height_occurence, colorPos);
                });

                var hex = color2hex(pixel);
                if (hex.indexOf("NaN") > -1) return;

                pixels_of_border.push(hex);
            })
        });


        resolve(pixels_of_border);

    });
};

BorderDetector.prototype.ArePixelsEquals = function (pixels) {
    return new Promise((resolve, reject) => {

        var refColor = pixels[0];

        var diffs = pixels.map((color, index, array) => {
            var diff = colorDiff.compare(refColor, color);

            return diff == 0;
        });

        var numberOfSimilars = diffs.filter((x) => { // are similar = are not differents under the ratio
            return x === true;
        }).length;

        var numberOfDifferents = diffs.filter((x) => { // are different = are not similars under the ratio
            return x === false;
        }).length;

        var areSimilar = numberOfSimilars > numberOfDifferents;

        return resolve(areSimilar);
    });
};

/**
 *
 * @param url URL of file to load. @see get-pixels doc
 * @param thickness number of pixels to fetch from borders
 * @returns {Promise.<T>}
 */
BorderDetector.prototype.detect = function (url, thickness) {
    return this.GetPixels(url)
        .then((pixels) => {
            return this.GetPixelsOfBorder(pixels, thickness);
        })
        .then((pixels) => {
            return this.ArePixelsEquals(pixels);
        })
        ;
};

/**
 *
 * @param url
 * @returns {Promise}
 * @constructor
 */
BorderDetector.prototype.GetPixels = function (url) {
    return new Promise((resolve, reject) => {
        GetPixels(url, (err, pixels) => {
            if (err) return reject(err);
            return resolve(pixels);
        })
        ;
    });
};

module.exports = BorderDetector;