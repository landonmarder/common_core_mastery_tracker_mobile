var url = 'http://www.AccessToCommonCore.com/api/math/6';

  $(document).ready(function() {

    $.support.cors = true;

    $.ajax({
      type: 'GET',
      url: url,
      accept: 'application/json',
      dataType: 'json',
      success: function(data) { makeCommonCoreList(data); },
      error: function() { alert('standards get failed!'); }
    });
  });

  function makeCommonCoreList(response) {
    var commonCore = response.data.common_core.children;
    formatDisplayHeaders(response.data.common_core);
    var content = '';

    $.each(commonCore, function (j, domainORstrand) {

      if (domainORstrand.hasOwnProperty('children')) {
        $.each(domainORstrand.children, function (k, cluster) {

        if (cluster.hasOwnProperty('children')) {
          $.each(cluster.children, function (l, standard) {
            content += formatStandard(standard);

            if (standard.hasOwnProperty('children')) {
                $.each(standard.children, function (m, standardDetail) {
                    content += formatStandardDetail(standardDetail)
                });
                content += formatEndList();
            }
          });
          content += formatEndList();
          }
        });
      }
    });

    $(content).appendTo("#list-of-standards");
  }

  // function formatDomainOrStrand(domain) {
  //   // return ('<li>'+domain.standard+'</li>');
  // }

  // function formatCluster(cluster) {
  //   // return ('<li>'+cluster.standard+'</li>');
  // }

  function formatStandard(standard) {
    return ('<li><a>'+ standard.standard_code+'</a> '+standard.standard+'</li>');
  }

  function formatStandardDetail(standardDetail) {
    return ('<li><a>'+ standardDetail.standard_code+'</a> '+standardDetail.standard+'</li>');
  }

  function formatBeginList() {
    return ('<ul>');
  }

  function formatEndList() {
    return ('</ul>');
  }

  function formatDisplayHeaders(firstStandard) {
    // var content = '<h3><p>' + firstStandard.standard + '</p><h3>';
  }
