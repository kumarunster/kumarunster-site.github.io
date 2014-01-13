
Here the steps to setup Jekyll with Yeoman, Bootstrap 3 with Awesome fonts.

1.) You need ruby > 1.9. with several gems. Install newest from from PPA:

found on [brightbox](http://blog.brightbox.co.uk/posts/next-generation-ruby-packages-for-ubuntu)

than you need NodeJs with NPM and several Node-Modules (Grunt, Bower, Yeoman generators)

{% highlight console %}
sudo apt-add-repository ppa:brightbox/ruby-ng
sudo apt-get update
sudo apt-get install ruby1.9.1 ruby1.9.1-dev rubygems1.9.1
sudo gem install bundler
sudo apt-get install nodejs nodejs-dev npm
sudo npm install -g yo
sudo npm install -g generator-jekyllrb
{% endhighlight %}

2) Create folder in that you set up you new site

{% highlight console %}
mkdir jekyll-with-yo
cd jekyll-with-yo
yo jekyllrb
{% endhighlight %}

after answering of diverse questions test the site

{% highlight console %}
grunt server
{% endhighlight %}

broweser opens on http://localhost:9000 and presents the site.

Download bootstrap 3 and font awesome

{% highlight console %}
bower install bootstrap-sass#3.0.0 --save
bower install font-awesome --save
{% endhighlight %}

change the setup

change the _scss/main.scss:

{% highlight css %}
@import "../_bower_components/bootstrap-sass/lib/bootstrap";

$FontAwesomePath: "/_bower_components/font-awesome/font";
@import "../_bower_components/font-awesome/scss/font-awesome";

{% endhighlight %}


change the _lyout/default.html

{% highlight html %}

<!doctype html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title></title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width">
    <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->

        <!-- build:css(.tmp) styles/main.css -->
        <link rel="stylesheet" href="/css/main.css">
        <!-- endbuild -->
</head>
  <body ng-app="yoAngularApp">
    <!--[if lt IE 7]>
      <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
    <![endif]-->

    <!--[if lt IE 9]>
      <script src="bower_components/es5-shim/es5-shim.js"></script>
      <script src="bower_components/json3/lib/json3.min.js"></script>
    <![endif]-->

    <!-- Add your site or application content here -->

      <nav class="navbar navbar-inverse" role="navigation">
  <!-- Brand and toggle get grouped for better mobile display -->
  <div class="navbar-header">
    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
      <span class="sr-only">Toggle navigation</span>
      <span class="icon-bar"></span>
      <span class="icon-bar"></span>
      <span class="icon-bar"></span>
    </button>
    <a class="navbar-brand" href="/">Home</a>
  </div>

  <!-- Collect the nav links, forms, and other content for toggling -->
  <div class="collapse navbar-collapse navbar-ex1-collapse">
    <ul class="nav navbar-nav">
      <li class="active"><a href="#">Link</a></li>
      <li><a href="#">Link</a></li>
      <li class="dropdown">
        <a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown <b class="caret"></b></a>
        <ul class="dropdown-menu">
          <li><a href="#">Action</a></li>
          <li><a href="#">Another action</a></li>
          <li><a href="#">Something else here</a></li>
          <li><a href="#">Separated link</a></li>
          <li><a href="#">One more separated link</a></li>
        </ul>
      </li>
    </ul>
    <form class="navbar-form navbar-left" role="search">
      <div class="form-group">
        <input type="text" class="form-control" placeholder="Search">
      </div>
      <button type="submit" class="btn btn-default">Submit</button>
    </form>
    <ul class="nav navbar-nav navbar-right">
      <li><a href="#">Link</a></li>
      <li class="dropdown">
        <a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown <b class="caret"></b></a>
        <ul class="dropdown-menu">
          <li><a href="#">Action</a></li>
          <li><a href="#">Another action</a></li>
          <li><a href="#">Something else here</a></li>
          <li><a href="#">Separated link</a></li>
        </ul>
      </li>
    </ul>
  </div><!-- /.navbar-collapse -->
</nav>
      
    <div class="container" ng-view="">
        
        {{ content }}
      
    </div>

    <!-- Google Analytics: change UA-XXXXX-X to be your site's ID -->
     <script>
       (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
       (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
       m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
       })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

       ga('create', 'UA-XXXXX-X');
       ga('send', 'pageview');
    </script>

    <script src="bower_components/jquery/jquery.js"></script>
    <script src="bower_components/angular/angular.js"></script>
    <script src="bower_components/angular-route/angular-route.js"></script>

        <!-- build:js scripts/plugins.js -->
        <script src="bower_components/bootstrap-sass/js/affix.js"></script>
        <script src="bower_components/bootstrap-sass/js/alert.js"></script>
        <script src="bower_components/bootstrap-sass/js/dropdown.js"></script>
        <script src="bower_components/bootstrap-sass/js/tooltip.js"></script>
        <script src="bower_components/bootstrap-sass/js/modal.js"></script>
        <script src="bower_components/bootstrap-sass/js/transition.js"></script>
        <script src="bower_components/bootstrap-sass/js/button.js"></script>
        <script src="bower_components/bootstrap-sass/js/popover.js"></script>
        <script src="bower_components/bootstrap-sass/js/typeahead.js"></script>
        <script src="bower_components/bootstrap-sass/js/carousel.js"></script>
        <script src="bower_components/bootstrap-sass/js/scrollspy.js"></script>
        <script src="bower_components/bootstrap-sass/js/collapse.js"></script>
        <script src="bower_components/bootstrap-sass/js/tab.js"></script>
        <!-- endbuild -->

        <!-- build:js({.tmp,app}) scripts/scripts.js -->
        <!-- endbuild -->
</body>
</html>

{% endhighlight %}