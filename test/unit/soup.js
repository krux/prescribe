/*
 ctx.write('<div><i></div>');
 ctx.write('foo');
 });

 testWrite('TS2', function(ctx) {
 ctx.write('<div><i>');
 ctx.write('<div>foo');
 ctx.write('<div><i>');
 });

 testWrite('foo should be italicized', function(ctx) {
 ctx.write('<div><i>');
 ctx.write('<div>foo');
 });

 testWrite('inside-out i/p', function(ctx) {
 ctx.write('<div><i></div>');
 ctx.write('<div>foo');
 });

 testWrite('TS5', function(ctx) {
 ctx.write('<div><i></div>');
 });

 testWrite('TS6', function(ctx) {
 ctx.write('<div><i></div>');
 ctx.write('<div>foo<i>');
 ctx.write('</div>bar');
 });

 testWrite('character placeholders', function(ctx) {
 ctx.write('<div><div><i></div>');
 ctx.write('foo');
 ctx.write('<div>bar</div>');
 });

 testWrite('just a close tag', function(ctx) {
 ctx.write('</i>');
 });

 testWrite('TS9', function(ctx) {
 ctx.write('<div><i></div>');
 ctx.write('foo');
 ctx.write('<div>');
 ctx.write('</i>');
 });

 testWrite('TS10', function(ctx) {
 ctx.write('<div><i></div>');
 ctx.write('foo');
 ctx.write('<div>bar');
 ctx.write('</i>');
 });

 testWrite('TS11', function(ctx) {
 ctx.write('<div><b><i></div>');
 ctx.write('foo');
 ctx.write('<div>bar<i>');
 ctx.write('</b>bla');
 });
 */
