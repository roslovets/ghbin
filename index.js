import './index.scss';

var query = window.location.hash.slice(1).replace(/^https?:\/\//i, '');
var download = document.getElementById('download');
var rlink = document.getElementById('rlink');
console.log(query);

if (query) {
    document.getElementById('buttons').style.display = 'inline-block';

    var params = query.split('#');
    var repo = params[0];

    rlink.href = window.location.hash.slice(1);
    document.getElementById('rname').textContent = 'Loading...';
    rlink.style.display = 'inline-block';

    if (repo) {
        //window.location.href = str;
        window.rName = '';
        window.rver = '';
        window.binName = params[1];
        var cbInfo = function (res) {
            console.log(res);
            window.rName = res.name;
            document.getElementById('rname').textContent = window.rName + ' ' + window.rVer;
        };

        var cbLatest = function (res) {
            console.log(res);
            window.rVer = res.name;
            document.getElementById('rname').textContent = window.rName + ' ' + window.rVer;
            document.getElementById('rlink').href = res.html_url;
            var assets = res.assets.filter(function (asset) {
                return asset.name === window.binName;
            });
            if (assets.length > 0) {
                document.getElementById('dlabel').textContent = 'Download ' + assets[0].name;
                document.getElementById('download').style.display = 'inline-block';
                document.getElementById('dlabel').style.display = 'inline-block';
            }
        };

        var cbErr = function (res) {
            console.log(res);
            var msg;
            if (res.status === 404) {
                msg = 'Repository not found';
            }
            else if (res.status === 403) {
                msg = 'Error: try again later';
            }
            if (msg) {
                document.getElementById('msg1').textContent = msg;
                document.getElementById('msg1').style.display = 'inline-block';
                document.getElementById('rlink').style.display = 'none';
            }
        };
    }

    httpGetAsync('https://api.github.com/repos/' + repo, cbInfo, cbErr);
    httpGetAsync('https://api.github.com/repos/' + repo + '/releases/latest', cbLatest, cbErr);
}

else {
    var loc = window.location.toString();
    if (loc[loc.length - 1] !== '#')
        window.location.href = loc + '#';
    document.getElementById('instr').style.display = 'inline-block';
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
    xmlHttp.open('GET', theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}