/*****************
 Program Settings
*****************/
const programSettings = {

    // linkColourer
    linkColourer: {
        methodEnabled: true,

        red: true,
        orange: false,
        yellow: false
    },

    smokeTest: {
        methodEnabled: false
    },

    urlRemover: {
        functionEnabled: true,
        ajaxEnabled: true,
        testColoring: false,
        clearVisibleContent: false,
        removeListWrap: {
            shortIcons: [
                "≥",
                "º",
                "▷",
                "ᐅ",
                "»",
                "«",
                "√",
                "ʘ",
                "•",
                "·",
                "'",
                "::",
                ",",
                ".",
                "→",
                "@",
                "~",
                "®",
                "›",
            ],

            longIcons: [
                "--",
                "->",
                "••>",
                "<••",
                "<-",
                "&gt;",
                "&gt;&gt;",
            ],

            words: [
                "home",
                "homepagina",
                "homepage,",
                "homepage",
                "startpagina:",
                "homepages®",
                "page",
                "links",
                "blog",
            ],

            isBetweenDots: [
                "startpagina",
                "youtube",
                "wikipedia",
                "facebook",
                "twitter",
                "linkedin",
            ],

            urls: [
                "com",
                "eu",
                "infonu",
                "net",
                "nl",
                "nl:",
                "org",
                "www",
                "be",
                "nu",
                "info",
                "gov",
                "biz",
            ],

            contains: [
                "facebook",
                "twitter",
                "linkedin",
            ],
        }
    },
};
