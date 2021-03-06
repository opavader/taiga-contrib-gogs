// Generated by CoffeeScript 1.9.3
(function() {
  var GogsAdmin, GogsWebhooksDirective, debounce, gogsInfo, initGogsPlugin, module;

  this.taigaContribPlugins = this.taigaContribPlugins || [];

  gogsInfo = {
    slug: "gogs",
    name: "Gogs",
    type: "admin",
    module: 'taigaContrib.gogs'
  };

  this.taigaContribPlugins.push(gogsInfo);

  module = angular.module('taigaContrib.gogs', []);

  debounce = function(wait, func) {
    return _.debounce(func, wait, {
      leading: true,
      trailing: false
    });
  };

  initGogsPlugin = function($tgUrls) {
    return $tgUrls.update({
      "gogs": "/gogs-hook"
    });
  };

  GogsAdmin = (function() {
    GogsAdmin.$inject = ["$rootScope", "$scope", "$tgResources", "tgAppMetaService", "$tgConfirm"];

    function GogsAdmin(rootScope, scope, rs, appMetaService, confirm) {
      this.rootScope = rootScope;
      this.scope = scope;
      this.rs = rs;
      this.appMetaService = appMetaService;
      this.confirm = confirm;
      this.scope.sectionName = "Gogs";
      this.scope.sectionSlug = "gogs";
      this.scope.$on('project:loaded', (function(_this) {
        return function() {
          var promise;
          promise = _this.rs.modules.list(_this.scope.projectId, "gogs");
          promise.then(function(gogs) {
            var description, title;
            _this.scope.gogs = gogs;
            title = _this.scope.sectionName + " - Plugins - " + _this.scope.project.name;
            description = _this.scope.project.description;
            return _this.appMetaService.setAll(title, description);
          });
          return promise.then(null, function() {
            return _this.confirm.notify("error");
          });
        };
      })(this));
    }

    return GogsAdmin;

  })();

  module.controller("ContribGogsAdminController", GogsAdmin);

  GogsWebhooksDirective = function($repo, $confirm, $loading) {
    var link;
    link = function($scope, $el, $attrs) {
      var form, submit, submitButton;
      form = $el.find("form").checksley({
        "onlyOneErrorElement": true
      });
      submit = debounce(2000, (function(_this) {
        return function(event) {
          var currentLoading, promise;
          event.preventDefault();
          if (!form.validate()) {
            return;
          }
          currentLoading = $loading().target(submitButton).start();
          promise = $repo.saveAttribute($scope.gogs, "gogs");
          promise.then(function() {
            currentLoading.finish();
            $confirm.notify("success");
            return $scope.$emit("project:modules:reload");
          });
          return promise.then(null, function(data) {
            currentLoading.finish();
            form.setErrors(data);
            if (data._error_message) {
              return $confirm.notify("error", data._error_message);
            }
          });
        };
      })(this));
      submitButton = $el.find(".submit-button");
      $el.on("submit", "form", submit);
      return $el.on("click", ".submit-button", submit);
    };
    return {
      link: link
    };
  };

  module.directive("contribGogsWebhooks", ["$tgRepo", "$tgConfirm", "$tgLoading", GogsWebhooksDirective]);

  module.run(["$tgUrls", initGogsPlugin]);

  module.run([
    '$templateCache', function($templateCache) {
      return $templateCache.put('contrib/gogs', '<div contrib-gogs-webhooks="contrib-gogs-webhooks" ng-controller="ContribGogsAdminController as ctrl"><header><h1><span class="project-name">{{::project.name}}</span><span class="green">{{::sectionName}}</span></h1></header><form><fieldset><label for="secret-key">Secret key</label><input type="text" name="secret-key" ng-model="gogs.secret" placeholder="Secret key" id="secret-key"/></fieldset><fieldset><div tg-select-input-text="tg-select-input-text" class="select-input-text"><div><label for="payload-url">Payload URL</label><div class="field-with-option"><input type="text" ng-model="gogs.webhooks_url" name="payload-url" readonly="readonly" placeholder="Payload URL" id="payload-url"/><div class="option-wrapper select-input-content"><div class="icon icon-copy"></div></div></div><div class="help-copy">Copy to clipboard: Ctrl+C</div></div></div></fieldset><button type="submit" class="hidden"></button><a href="" title="Save" class="button-green submit-button"><span>Save</span></a></form><a href="https://taiga.io/support/gogs-integration/" target="_blank" class="help-button"><span class="icon icon-help"></span><span>Do you need help? Check out our support page!</span></a></div>');
    }
  ]);

}).call(this);
