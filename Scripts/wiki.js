function getWikiData(userName, repoName, pageName, targetDivisionName, callback)
{
	var pageUrl = getPageUrl(pageName);
	var pageName = getPageName(pageName);

	var version = getVersion(repoName);
	if (version != "")
    {
	    version = "/" + version;
	}
	
	var	wikiUrl = getWikiUrl(userName, repoName);
		url = [
		"http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20data.headers%20where%20url%3D%22",
		wikiUrl, pageUrl, version, 
		"%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=?"].join('');
		
	/*$.ajax({
		type: "GET",
		dataType: "jsonp",
		url: url,
		//success: function(data){ callback(pageName, pageUrl, wikiUrl, targetDivisionName, data.query.results.resources.content); },
		error: function (XMLHttpRequest, textStatus, errorThrown) {	alert("Your browser is not supported. Please use an actual version of Chrome, Firefox or Safari."); }
	});*/
		
	$.getJSON(url, callback).error(function(jqXHR, textStatus, errorThrown) 
	    { 
		    alert("Your browser is not supported. Please use an actual version of Chrome, Firefox or Safari.<br><br>Error Details: " + errorThrown); 
		})
}

function getPageUrl(pageName)
{
	var pageName = pageName || 'Home';
	pageUrl = pageName.replace(/ /g, "-");
	pageUrl = pageUrl.replace(/%20/g, "-");
	return pageUrl;
}

function getPageName()
{
	var pageName = pageName || 'Home';
	pageName = pageName.replace(/%20/g, " ");
    return pageName;
}

function getWikiUrl(userName, repoName)
{
	return ['https://github.com/', userName, '/', repoName, '/wiki/'].join('');
}

function showWikiPage(userName, repoName, pageName, targetDivisionName) {
	getWikiData(userName, repoName, pageName, targetDivisionName, 
	    function(data) { showWikiPageCallback(getPageName(pageName), getPageUrl(pageName), getWikiUrl(userName, repoName), targetDivisionName, data.query.results.resources.content) })
}

function showNinjectWikiPage(project, pageName)
{
    showWikiPage('ninject', project, pageName, "#wiki-content2");
}

function showWikiPageCallback(pageName, pageUrl, wikiUrl, targetDivisionName, content)
{
    var contentHtml = $("#wiki-content", content).html();
	contentHtml = contentHtml.replace(/ href="(?:https:\/\/github\.com)?\/ninject\/([^\/"]*)\/wiki\/([^\/"]*)"/gm, ' href="javascript:showNinjectWikiPage(\'$1\', \'$2\')"');
    var title = $("#head > h1", content).html();
	contentHtml = [
		'<div id="wiki-wrapper" class="page">',
			'<div id="head">',
				'<h1 class="instapaper_title">', title, '</h1>',
				'<ul class="wiki-actions readability-extra">',
					'<li class="gollum-minibutton"><a href="', wikiUrl, pageUrl, '/_edit" class="action-edit-page">Edit Page</a></li>',
					'<li class="gollum-minibutton"><a href="', wikiUrl, pageUrl, '/_history" class="action-page-history">Page History</a></li>',
				'</ul>',
			'</div>',
			'<div id="wiki-content">',
				contentHtml,
			'</div>',
		'</div>'].join('');
    $(targetDivisionName).html(contentHtml);
	var styleSheets = content.match(/<[^>]*href="[^"]*github[^"]*" [^>]*rel="stylesheet"[^>]*>/gm);
	for (var i = 0; i < styleSheets.length; ++i)
	    $(targetDivisionName).append(styleSheets[i]);
	
	$.syntax({context: $(targetDivisionName), blockLayout: 'plain', theme: 'modern'});
}

function showNavigation(userName, repoName, pageName, targetDivisionName)
{
	getWikiData(userName, repoName, pageName, targetDivisionName, 
    	function(data) { showNavigationCallback(getPageName(pageName), getPageUrl(pageName), getWikiUrl(userName, repoName), targetDivisionName, data.query.results.resources.content) })
}

function showNavigationCallback(pageName, pageUrl, wikiUrl, targetDivisionName, content)
{
    var dataCode = $("#wiki-body > div > pre > code", content).html();
	var script = [
	'<div id="tree111"></div>',
	'<script type="text/javascript">',
    dataCode,
    "initTree(data);",	
    "</script>"].join('');	
	$(targetDivisionName).html(script);
}

function initTree(data2)
{
	$('#tree111').tree({
		data: data2,
		autoOpen: false,
		dragAndDrop: false,
		selectable: false	
	});	
}

function getVersion(project)
{
	return versions[project][$("#VersionCombobox").val()];
}

function versionChanged()
{
	showNavigation('ninject', 'ninject', "Navigation", '#wiki-navigation');
}