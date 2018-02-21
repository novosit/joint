/* jshint unused: false */
'use strict';
var ignore = ['demo', 'demos', 'dist', 'lib', 'plugins', 'src', 'test', 'tools', 'www'];
var profile = {
	resourceTags: {
		amd: function(filename, mid) {
			return (/JointAmd\.js/).test(filename);
		}
		//,
		//ignore: function(filename/*, mid*/) {
		//	var cnt, excluded = false;
		//	for (cnt=0;(cnt < ignore.length) && !excluded; cnt += 1){
		//		if (filename.indexOf(ignore[cnt]) >= 0) {
		//			excluded = true;
		//		}
		//	}
		//	return excluded;
		//}
	}
};