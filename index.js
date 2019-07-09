import './index.scss';

var lang = navigator.language || navigator.userLanguage;
if (lang === 'ru-RU') {
    var TGSTR = 'Открыть в Telegram';
    var WEBSTR = 'Открыть в браузере';
}
else {
    TGSTR = 'Open in Telegram';
    WEBSTR = 'Open in browser';
}

var url = window.location.hash.slice(1).replace(/^https?:\/\//i, '');
var tgopen = document.getElementById('tgopen');
var webopen = document.getElementById('webopen');
var target = document.getElementById('target');

if (url) {
    document.getElementById('buttons').style.display = 'inline-block';

    document.getElementById('tglabel').textContent = TGSTR;

    var repo = window.location.hash.slice(1);

    var path = tgopen.pathname.split('/', 3);
    var str = '';
    var ischannel = false;

    console.log(path);
    console.log(repo);

    switch (path[1]) {
        case 'socks':
            str = 'tg://socks' + tgopen.search;
            break;
        case 'share':
            str = 'tg://msg_' + path[2] + tgopen.search;
            break;
        case 'joinchat':
            str = 'tg://join?invite=' + path[2];
            break;
        case 'addstickers':
            str = 'tg://addstickers?set=' + path[2];
            break;
        case 'proxy':
            str = 'tg://proxy' + tgopen.search;
            break;
        default:
            str = 'tg://resolve?domain=' + path[1] + tgopen.search.replace('?start=', '&start=');
            if (path[2]) {
                str += '&post=' + path[2];
            }
            else
                ischannel = true;
    }

    tgopen.href = str || '#';

    if (ischannel) {
        webopen.href = "https://tfeed.me/" + path[1];
        document.getElementById('weblabel').textContent = WEBSTR;
        webopen.style.display = 'inline-block';
    }

    target.href = window.location.hash.slice(1);
    document.getElementById('tlabel').textContent = url;
    target.style.display = 'inline-block';

    if (str) {
        //window.location.href = str;
        window.rName = '';
        window.rver = '';
        var cbInfo = function(res) {
            console.log(res);
            window.rName = res.name;
            document.getElementById('tlabel').textContent = window.rName + ' ' + window.rVer;
        }

        var cbLatest = function(res) {
            console.log(res);
            window.rVer = res.name;
            document.getElementById('tlabel').textContent = window.rName + ' ' + window.rVer;
            document.getElementById('target').href = res.html_url;
        }
        httpGetAsync('https://api.github.com/repos/' + repo, cbInfo);
        httpGetAsync('https://api.github.com/repos/' + repo + '/releases/latest', cbLatest);
    }
}
else {
    var loc = window.location.toString();
    if (loc[loc.length - 1] !== '#')
        window.location.href = loc + '#';
    document.getElementById('instr').style.display = 'inline-block';
}
tgopen.style.display = 'inline-block';


function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(JSON.parse(xmlHttp.responseText));
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}