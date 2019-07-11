import './index.scss';

var query = window.location.hash.slice(1).replace(/^https?:\/\//i, '');

if (query) {

    var params = query.split('#');
    var repo = params[0];

    showMsg('msg1', 'Loading...');

    if (repo) {
        window.rName = '';
        window.rver = '';
        window.binName = params[1];

        var cbInfo = function (res) {
            window.rName = res.name;
            window.rHome = res.html_url;
            showRepo();
        };

        var cbInfoErr = function (res) {
            var msg;
            if (res.status === 404) {
                msg = 'Repository not found';
            }
            else {
                msg = 'Error: try again later';
            }
            if (msg) {
                showMsg('msg1', msg);
                showBtn('repo', false);
            }
        };

        var cbLatest = function (res) {

            window.rVer = res.name;
            window.rUrl = res.html_url;
            var assets;

            if (window.binName) {
                assets = res.assets.filter(function (asset) {
                    return asset.name === window.binName;
                });
            }
            else {
                if (res.assets) {
                    assets = res.assets;
                }
            }
            if (assets && assets.length > 0) {
                window.rBin = assets[0];
            }
            showRepo();
        };

        var cbLatestErr = function (res) {
            window.rVer = '<null>';
            showRepo();
        };
    }

    httpGetAsync('https://api.github.com/repos/' + repo, cbInfo, cbInfoErr);
    httpGetAsync('https://api.github.com/repos/' + repo + '/releases/latest', cbLatest, cbLatestErr);
}

else {
    var loc = window.location.toString();
    if (loc[loc.length - 1] !== '#') {
        window.location.href = loc + '#';
    }
    showBtn('repo', 'GitHub Binary Downloader', 'https://github.com/roslovets/ghbin');
    showBtn('binary', 'How to use', 'https://github.com/roslovets/ghbin/blob/master/README.md');
}


function showRepo() {
    if (window.rName && window.rVer) {
        if (window.rVer === '<null>') {
            showBtn('repo', window.rName, window.rHome);
        }
        else {
            showBtn('repo', window.rName + ' ' + window.rVer, window.rUrl);
        }
        showMsg('msg1', false);
        if (window.rBin) {
            showBtn('binary', 'Download ' + window.rBin.name, window.rBin.browser_download_url);
            showMsg('msg3', '\u2193 downloading...');
            window.location.href = window.rBin.browser_download_url;
        }
        else {
            showMsg('msg2', 'Binary not found');
        }
    }
}

function showMsg(el, msg) {
    if (msg) {
        document.getElementById(el).textContent = msg;
        document.getElementById(el).style.display = 'inline-block';
    }
    else {
        document.getElementById(el).style.display = 'none';
    }
}

function showBtn(el, label, href) {
    var btn = document.getElementById(el);
    var txt = btn.firstElementChild;
    if (label) {
        txt.textContent = label;
        txt.style.display = 'inline-block';
        btn.href = href;
        btn.style.display = 'inline-block';
    }
    else {
        txt.style.display = 'none';
        btn.style.display = 'none';

    }
}

function httpGetAsync(theUrl, cb, errcb) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.timeout = 1000;
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4)
            if (xmlHttp.status === 200)
                cb(JSON.parse(xmlHttp.responseText));
            else
                errcb(xmlHttp);
    };
    xmlHttp.open('GET', theUrl, true);
    xmlHttp.send(null);
}