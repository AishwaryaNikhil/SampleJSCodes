var vesselInfo = angular.module('mmVimsApplication.mainPageModule', ['angularUtils.directives.dirPagination', 'md.data.table', 'ngMessages']);
vesselInfo.directive('mainPanel', function () {
    return {
        restrict: 'E',
        templateUrl: 'html/main.html'
    };
});

vesselInfo.directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);
vesselInfo.controller('vesselController', ['$scope', '$rootScope', '$http', '$mdSidenav', '$mdDialog', '$location',
    'restTokenCheck', 'restGetVesselsList', 'restGetAreaListByVesselId', 'restGetVesselPicByVesselName',
    'restGetDocGroupByCategoryId', 'restAddTree', 'restAddNewDocument',
    'restAddVessel', 'restGetDocPath', 'restDeleteTree', 'restDeleteVessel',
    'restEditTree', 'restEditVesselPicture', 'restGetVesselDetailsbyID', 'restEditVesselData', 'restEditDoc',
    'restGetVesselType', 'restAddNewVesselTye', 'restAddListofAreas', 'restGetCompanyList', 'restGetVesselsbyOwner',
    'restGetUsersListbyGroupbyShipOwner', '$route',
    function ($scope, $rootScope, $http, $mdSidenav, $mdDialog, $location,
            restTokenCheck, restGetVesselsList, restGetAreaListByVesselId, restGetVesselPicByVesselName,
            restGetDocGroupByCategoryId, restAddTree, restAddNewDocument,
            restAddVessel, restGetDocPath, restDeleteTree, restDeleteVessel,
            restEditTree, restEditVesselPicture, restGetVesselDetailsbyID, restEditVesselData, restEditDoc, restGetVesselType,
            restAddNewVesselTye, restAddListofAreas, restGetCompanyList, restGetVesselsbyOwner, restGetUsersListbyGroupbyShipOwner, $route) {
        console.log("Vessel Controller Started");
        
        
        
        $scope.selectedAreaid = null;
//Disable all icons
        $scope.areasection = true;
        $scope.selectvessel = true;
        $scope.addnewvessel = false;
        $scope.managevessel = false;
        $scope.managearea = false;
        $scope.managecategory = false;
        $scope.managedocgroup = false;
        $scope.managedocgroup1 = false;
        $scope.showusertab = false;
        $scope.showcompanytab = false;
        
        
       
        $scope.loadmultimarine = function ()
        {
            window.open("http://www.multimarine.no");
        };
       
       $scope.loadVesselTab = function()
       {
           $route.reload();
       };
        
        $scope.onTabChanges = function (currentTabIndex) {

            $scope.currentTab = currentTabIndex;

            if ($scope.currentTab === 0)
            {
                $scope.onvesselstab = true;
                $scope.onuserstab = false;
                $scope.oncompaniestab = false;
                               
            } else if ($scope.currentTab === 1)
            {
                $scope.onuserstab = true;
                $scope.onvesselstab = false;
                $scope.oncompaniestab = false;
                  
            } else if ($scope.currentTab === 2)
            {
               
                $scope.onuserstab = false;
                $scope.onvesselstab = false;
                $scope.oncompaniestab = true;
            } else
            {

            }
        };

        $scope.limitOptions = [5, 10, 15];
        $scope.options = {
            rowSelection: true,
            multiSelect: true,
            autoSelect: true,
            boundaryLinks: true,
            limitSelect: true,
            pageSelect: true
        };
        $scope.query = {
            order: 'name',
            limit: 5,
            page: 1
        };
        $scope.toggleLimitOptions = function () {
            $scope.limitOptions = $scope.limitOptions ? undefined : [5, 10, 15];
        };

        $scope.toggleSideNavList = function ()
        {
            $mdSidenav('sidenav').toggle();
        };
        var auth = getCookieToken("token");
        function getCookieToken(token)
        {
            var vtoken = token + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(vtoken) === 0) {
                    return c.substring(vtoken.length, c.length);
                }
            }
            return "";
        }
        ;
        var user = getCookieUser("username");
        function getCookieUser(username)
        {
            var user = username + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(user) === 0) {
                    return c.substring(user.length, c.length);
                }
            }
            return "";
        }
        ;
        var role = getCookieRole("role");
        function getCookieRole(role)
        {
            var group = role + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(group) === 0) {
                    return c.substring(group.length, c.length);
                }
            }
            return "";
        }
        ;

        if (role === "Administrator")
        {
            $scope.addnewvessel = true;
            $scope.showusertab = true;
            $scope.showcompanytab = true;
            $scope.showcompanylist = true;
        }
        //Check if the User has Valid Token to load the Page and get the role so that icons can be displayed accordingly. 
        restTokenCheck.checkToken({token: auth,
            login: user},
                function (response)
                {
                    document.cookie = "role" + "=" + response.group;
                    //Once the token is verified, Get the Vessels List for that User. 
                    if (role !== "Administrator")
                    {
                        restGetVesselsList.getVesselsList({token: auth,
                            login: user}, function (response)
                        {

                            $scope.VesselList = response.vessel;

                        },
                                function (error)
                                {
                                    var failure = error.data.message;
                                    alert(failure);

                                    $location.path('/login');

                                });
                    }

                    if (role === "Administrator")
                    {
                        restGetCompanyList.getCompany({token: auth, login: user}, function (response)
                        {
                            $scope.vesselcompany = response.shipowner;
                            //get vessel list based on company name. 
                            $scope.loadVesselsbyCompany = function (companyid)
                            {
                                $scope.VesselList = null;
                                $scope.onvesselchange = false;
                                $scope.areasection = false;
                                $scope.managevessel = false;
                                restGetVesselsbyOwner.getVesselbyOwner({token: auth,
                                    login: user, id: companyid}, function (response)
                                {

                                    $scope.VesselList = response.vessel;


                                },
                                        function (error)
                                        {
                                            var failure = error.data.message.toString();
                                            console.log(JSON.stringify(failure));
                if(failure == "There is no Vessels assigned to the Company")
                {
                 $mdDialog.show(
                        $mdDialog.alert()
                        .parent(angular.element(document.querySelector('#vesselcontainer')))
                        .clickOutsideToClose(true)
                        .title('Unable to load Vessels')
                        .textContent(JSON.stringify(failure))
                        .ariaLabel('Alert Dialog Demo')
                        .ok('OK')
                        );
                }
                else if (failure != "There is no Vessels assigned to the Company")
                {
                $mdDialog.show(
                        $mdDialog.alert()
                        .parent(angular.element(document.querySelector('#vesselcontainer')))
                        .clickOutsideToClose(true)
                        .title('Unable to load Vessels')
                        .textContent(JSON.stringify(failure))
                        .ariaLabel('Alert Dialog Demo')
                        .ok('OK')
                        );
                }
                else
                {}
                                            $scope.addArea = false;
                                            $scope.addCategory = false;
                                            $scope.addDocGroup = false;
                                            $scope.addDocument = false;
                                            $scope.addVessels = false;

                                            $scope.EditArea = false;
                                            $scope.EditCategory = false;
                                            $scope.EditDocGroup = false;
                                            $scope.EditPicture = false;
                                            $scope.EditVesselsInfo = false;
                                            $scope.editDocument = false;


                                            $scope.ondocgroupclick = false;
                                            $scope.oncategoryclick = false;
                                            $scope.onvesselstab = false;
                                            $scope.onvesselchange = false;
                                            $scope.VesselList = null;

                                        });
                            };

                        }, function (error)
                        {
                            
                if(failure == "There is no Companies in the database")
                {
                 //   alert("OK");
                }
                else if (failure != "There is no Companies in the database")
                {
                $mdDialog.show(
                        $mdDialog.alert()
                        .parent(angular.element(document.querySelector('#vesselcontainer')))
                        .clickOutsideToClose(true)
                        .title('Unable to fetch ShipOwner Details')
                        .textContent(JSON.stringify(error.message))
                        .ariaLabel('Alert Dialog Demo')
                        .ok('OK')
                        );
                }
                else
                {}

                        });

                    }


                },
                function (error)
                {
                    var failure = error.data.message;
                    $mdDialog.show(
                            $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#logincontainer')))
                            .clickOutsideToClose(true)
                            .title('UnAuthorized Access!!')
                            .textContent(failure)
                            .ariaLabel('Alert Dialog Demo')
                            .ok('OK')
                            );

                    $location.path('/login');
                    delete_cookie('role');
                    delete_cookie('token');
                    delete_cookie('username');
                });
        //Options to manage vessels
        var originatorEv;

        $scope.openMenu = function ($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        };
        //Load the area based on the vesselid                          
        $scope.loadArea = function (vesselid)
        {
            $scope.idvessel = vesselid;
            if ($scope.idvessel != null)
            {
                $scope.addArea = false;
                $scope.addCategory = false;
                $scope.addDocGroup = false;
                $scope.addDocument = false;
                $scope.addVessels = false;

                $scope.EditArea = false;
                $scope.EditCategory = false;
                $scope.EditDocGroup = false;
                $scope.EditPicture = false;
                $scope.EditVesselsInfo = false;
                $scope.editDocument = false;
                $scope.areasection = true;
                    

                $scope.ondocgroupclick = false;
                $scope.oncategoryclick = false;
                $scope.onvesselstab = true;

                restGetAreaListByVesselId.getTree({token: auth,
                    login: user, parentid: $scope.idvessel}, function (response)
                {
                    $scope.areasection = true;
                    $scope.AreaList = response.tree;

                    if (role === "Administrator")
                    {
                        $scope.managevessel = true;
                        $scope.managearea = true;

                    }

                }, function (error)
                {

                    $mdDialog.show(
                            $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#vesselcontainer')))
                            .clickOutsideToClose(true)
                            .title('No Categories, Sub Categories, DocGroups are added')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('OK')
                            );
                    $scope.areasection = false;

                    if (role === "Administrator")
                    {
                        $scope.managevessel = true;
                    }

                });
            } else
            {
                $mdDialog.show(
                        $mdDialog.alert()
                        .parent(angular.element(document.querySelector('#vesselcontainer')))
                        .clickOutsideToClose(true)
                        .title('No Vessels are assigned. Please contact Admin')
                        .ariaLabel('Alert Dialog Demo')
                        .ok('OK')
                        );
            }
        };

        //Load the category based on the category 
        $scope.opened = "false";
        $scope.prevareaid = null;
        $scope.checkAreaLoaded = function (areaid)
        {
            $scope.newareaid = areaid;
            if ($scope.prevareaid === $scope.newareaid)
            {
                $scope.prevareaid = areaid;
                if ($scope.opened === "false")
                {
                    $scope.loadCategory(areaid);
                    $scope.opened = "true";

                } else
                {
                    $scope.opened = "false";
                    $scope.CategoryList = null;
                }
            } else
            {
                $scope.prevareaid = areaid;
                $scope.loadCategory(areaid);
                $scope.opened = "true";
            }


        };

        $scope.loadCategory = function (areaid)

        {
            $scope.addArea = false;
            $scope.addCategory = false;
            $scope.addDocGroup = false;
            $scope.addDocument = false;
            $scope.addVessels = false;

            $scope.EditArea = false;
            $scope.EditCategory = false;
            $scope.EditDocGroup = false;
            $scope.EditPicture = false;
            $scope.EditVesselsInfo = false;
            $scope.editDocument = false;

            $scope.CategoryList = null;
            $scope.ondocgroupclick = false;
            $scope.oncategoryclick = false;

            $scope.editDocument = false;

            restGetAreaListByVesselId.getTree({token: auth,
                login: user, parentid: areaid},
                    function (response)
                    {

                        $scope.CategoryList = response.tree;
                        $scope.selectedAreaid = areaid;

                        if (role === "Administrator")
                        {
                            $scope.managecategory = true;
                        }
                    }
            , function (error)
            {
                $scope.CategoryList = null;
                var failure = error.data.message;
                $mdDialog.show(
                        $mdDialog.alert()
                        .parent(angular.element(document.querySelector('#vesselcontainer')))
                        .clickOutsideToClose(true)
                        .textContent("No Sub Categories added for the Category. Please contact Administrator")
                        .ariaLabel('Alert Dialog Demo')
                        .ok('OK')
                        );
            });


        };

        //Load Pic of Vessel
        $scope.changePic = function (vesselname)
        {
            if (vesselname !== "")
            {
                $scope.onvesselchange = true;

                if (role === "Administrator")
                {
                    $scope.updatepic = true;
                }
                restGetVesselPicByVesselName.getVesselPic({token: auth,
                    login: user, name: vesselname}, function (response)
                {

                    $scope.selectedvesselpic = response;
                }
                , function (error)
                {
                    $scope.selectedvesselpic = null;
                    $scope.onvesselchange = false;


                });
            } else
            {
                $scope.onvesselchange = false;

            }


        };

        //display document group
        $scope.getDocGroup = function (categoryid, areaname, categoryname)
        {
            $scope.oncategoryclick = true;
            $scope.ondocgroupclick = false;
            $scope.areaname = areaname + " / ";
            $scope.categoryname = categoryname;
            $rootScope.categoryid = categoryid;
            $rootScope.areaname = areaname;
            $rootScope.categoryname = categoryname;

            $scope.addArea = false;
            $scope.addCategory = false;
            $scope.addDocGroup = false;
            $scope.addDocument = false;
            $scope.addVessels = false;


            $scope.EditArea = false;
            $scope.EditCategory = false;
            $scope.EditDocGroup = false;
            $scope.EditPicture = false;
            $scope.EditVesselsInfo = false;
            $scope.editDocument = false;

            restGetDocGroupByCategoryId.getDocGroup({token: auth,
                login: user, parentid: categoryid}, function (response)
            {


                $scope.DocGroup = response.tree;

                if (role === "Administrator")
                {
                    $scope.managedocgroup = true;
                }
                if (role === "Inspector")
                {
                    $scope.managedocgroup1 = true;
                }

            }
            , function (error)
            {
                var failure = error.data.message;
                $scope.DocGroup = "";
                $mdDialog.show(
                        $mdDialog.alert()
                        .parent(angular.element(document.querySelector('#vesselcontainer')))
                        .clickOutsideToClose(true)
                        .textContent("No Document Group found for the Sub Category. Please contact Administrator")
                        .ariaLabel('Alert Dialog Demo')
                        .ok('OK')
                        );

            });
        };

        //get documents in document group

        $scope.viewdocindocgroup = function (docgroupid, docgroupname)
        {

            $scope.ondocgroupclick = true;
            $scope.oncategoryclick = false;
            $scope.addVessels = false;
            $scope.addArea = false;
            $scope.addCategory = false;
            $scope.addDocGroup = false;
            $scope.addDocument = false;

            $scope.EditArea = false;
            $scope.EditCategory = false;
            $scope.EditDocGroup = false;
            $scope.EditPicture = false;
            $scope.EditVesselsInfo = false;
            $scope.editDocument = false;

            $scope.docgroupname = docgroupname;
            restGetDocPath.getDocs({token: auth,
                login: user, parentid: docgroupid}, function (response)
            {

                $rootScope.doclists = response.tree;
                if (role === "Administrator")
                {
                    $scope.managedocgroup = true;
                }

                if (role === "Administrator" || role === "Inspector")
                {
                    $scope.deletedoc = "true";
                }
                $scope.doclists = $rootScope.doclists;
                $scope.doclength = $scope.doclists.length;


                $scope.opendoc = function (docspath)
                {

                    //code to invoke the rests
                    window.open("http://itekvrsoftware.com/vims/files/" + docspath);
                };

                //delete doc
                $scope.deleteDoc = function (docid)
                {
                    $scope.parentid = docid;

                    var confirm = $mdDialog.confirm()
                            .title('Delete Document')
                            .textContent('Are You Sure You Want to Delete the Document')
                            .ariaLabel('Saved')
                            .ok('YES')
                            .cancel('NO');

                    $mdDialog.show(confirm).then(function () {
                        restDeleteTree.deleteTree({token: auth,
                            login: user,
                            id: $scope.parentid}, function (response)
                        {

                            $mdDialog.show(
                                    $mdDialog.alert()
                                    .parent(angular.element(document.querySelector('#vesselcontainer')))
                                    .clickOutsideToClose(true)
                                    .title('Deleted Successfully')
                                    .textContent("The Document is Deleted")
                                    .ariaLabel('Alert Dialog Demo')
                                    .ok('OK')
                                    );
                            $scope.viewdocindocgroup(docgroupid, docgroupname);
                        }, function (error)
                        {

                            $mdDialog.show(
                                    $mdDialog.alert()
                                    .parent(angular.element(document.querySelector('#vesselcontainer')))
                                    .clickOutsideToClose(true)
                                    .title('Unable to Delete')
                                    .textContent("Please try again later")
                                    .ariaLabel('Alert Dialog Demo')
                                    .ok('OK')
                                    );
                        });


                    }, function (cancel) {

                    });
                };

                $scope.back = function (docgroupid, docgroupname)
                {

                    $scope.getDocGroup($rootScope.categoryid, $rootScope.areaname, $rootScope.categoryname);
                };

            }, function (error)
            {
                var failure = error.data.message;
                $scope.doclists = "";
                $mdDialog.show(
                        $mdDialog.alert()
                        .parent(angular.element(document.querySelector('#vesselcontainer')))
                        .clickOutsideToClose(true)
                        .textContent("No Document found for the Document Group")
                        .ariaLabel('Alert Dialog Demo')
                        .ok('OK')
                        );
                $scope.getDocGroup($rootScope.categoryid, $rootScope.areaname, $rootScope.categoryname);

            });

        };
        //signout
        $scope.signOut = function ()
        {
            $location.path('/login');
            delete_cookie('role');
            delete_cookie('token');
            delete_cookie('username');
        };
        var delete_cookie = function (name) {
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        };

        //add New Area
        $scope.addarea = function (vesselid)
        {
            document.getElementById("addareaform").reset();
            $scope.isDisabled = false;
            $scope.aname = "";
            $scope.adesc = "";
            $scope.oncategoryclick = false;
            $scope.ondocgroupclick = false;
            $scope.addArea = true;
            $scope.addCategory = false;
            $scope.addDocGroup = false;
            $scope.addVessels = false;
            $scope.addDocument = false;

            $scope.EditArea = false;
            $scope.EditCategory = false;
            $scope.EditDocGroup = false;
            $scope.EditPicture = false;
            $scope.EditVesselsInfo = false;
            $scope.editDocument = false;

            $scope.saveArea = function ()
            {
                $scope.isDisabled = true;
                $scope.areaname = $scope.aname;
                $scope.vesselid = vesselid;
                if ($scope.adesc == null)
                {
                    $scope.adesc = "";
                }
                if ($scope.aname == "")
                {
                    $mdDialog.show(
                            $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#vesselcontainer')))
                            .clickOutsideToClose(true)
                            .title('Please enter Category Name')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('OK')
                            );
                    $scope.isDisabled = false;
                }
                if ($scope.aname != "")
                {
                    restAddTree.addTree({token: auth,
                        login: user, parentid: $scope.vesselid, name: $scope.aname, description: $scope.adesc}, function (response)
                    {
                        $scope.aname = "";
                        $scope.adesc = "";
                        $mdDialog.show(
                                $mdDialog.alert()
                                .parent(angular.element(document.querySelector('#vesselcontainer')))
                                .clickOutsideToClose(true)
                                .title('Category Added Successfully')
                                .ariaLabel('Alert Dialog Demo')
                                .ok('OK')
                                );

                        $scope.loadArea($scope.vesselid);
                        document.getElementById("addareaform").reset();

                    }
                    , function (error)
                    {

                        $mdDialog.show(
                                $mdDialog.alert()
                                .parent(angular.element(document.querySelector('#vesselcontainer')))
                                .clickOutsideToClose(true)
                                .title("An Error Occured. Please retry with a Unique Category Name")
                                .ariaLabel('Alert Dialog Demo')
                                .ok('OK')
                                );
                        $scope.isDisabled = false;

                    });

                }

            };

            $scope.cancel = function ()
            {
                $scope.addArea = false;
                $scope.aname = "";
                $scope.adesc = "";
            };


        };


        //add new category
        $scope.addcategory = function (areaid, areaname)
        {
            $scope.cname = "";
            $scope.cdesc = "";
            $scope.areaname = areaname;
            $scope.oncategoryclick = false;
            $scope.ondocgroupclick = false;
            $scope.addArea = false;
            $scope.addCategory = true;
            $scope.addDocGroup = false;
            $scope.addDocument = false;
            $scope.addVessels = false;

            $scope.EditArea = false;
            $scope.EditCategory = false;
            $scope.EditDocGroup = false;
            $scope.EditPicture = false;
            $scope.EditVesselsInfo = false;
            $scope.editDocument = false;
            $scope.isDisabled = false;

            $scope.saveCategory = function ()
            {
                $scope.isDisabled = true;
                $scope.areaid = areaid;
                if ($scope.cdesc == null)
                {
                    $scope.cdesc = "";
                }
                if ($scope.cname == "")
                {
                    $mdDialog.show(
                            $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#vesselcontainer')))
                            .clickOutsideToClose(true)
                            .title('Please enter Sub Category Name')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('OK')
                            );
                    $scope.isDisabled = false;
                }
                if ($scope.cname != "")
                {
                    restAddTree.addTree({token: auth,
                        login: user, parentid: $scope.areaid, name: $scope.cname, description: $scope.cdesc}, function (response)
                    {
                        $mdDialog.show(
                                $mdDialog.alert()
                                .parent(angular.element(document.querySelector('#vesselcontainer')))
                                .clickOutsideToClose(true)
                                .title('New Sub Category Added Successfully')
                                .ariaLabel('Alert Dialog Demo')
                                .ok('OK')
                                );
                        $scope.cname = "";
                        $scope.cdesc = "";
                        $scope.loadCategory($scope.areaid);



                    }
                    , function (error)
                    {

                        $mdDialog.show(
                                $mdDialog.alert()
                                .parent(angular.element(document.querySelector('#vesselcontainer')))
                                .clickOutsideToClose(true)
                                .title("An Error Occured. Please retry with a Unique Sub Category Name")
                                .ariaLabel('Alert Dialog Demo')
                                .ok('OK')
                                );
                        $scope.isDisabled = false;

                    });

                }

            };

            $scope.cancel = function ()
            {
                $scope.addCategory = false;
                $scope.cname = "";
                $scope.cdesc = "";
            };

        };

        //add new document group
        $scope.adddocgroup = function (categoryid, areaname, categoryname)
        {

            $scope.dgname = "";
            $scope.dgdesc = "";
            $scope.addArea = false;
            $scope.oncategoryclick = false;
            $scope.ondocgroupclick = false;
            $scope.addCategory = false;
            $scope.addDocGroup = true;
            $scope.addVessels = false;
            $scope.addDocument = false;

            $scope.EditArea = false;
            $scope.EditCategory = false;
            $scope.EditDocGroup = false;
            $scope.EditPicture = false;
            $scope.EditVesselsInfo = false;
            $scope.isDisabled = false;
            $scope.editDocument = false;

            $scope.saveDocGroup = function ()
            {
                $scope.isDisabled = true;
                $scope.categoryid = categoryid;
                if ($scope.dgdesc == "")
                {
                    $scope.dgdesc = "";
                }
                if ($scope.dgname == "")
                {
                    $mdDialog.show(
                            $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#vesselcontainer')))
                            .clickOutsideToClose(true)
                            .title('Please enter Document Group Name')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('OK')

                            );
                    $scope.isDisabled = false;
                }
                if ($scope.dgname != "")
                {
                    restAddTree.addTree({token: auth,
                        login: user, parentid: $scope.categoryid, name: $scope.dgname, description: $scope.dgdesc}, function (response)
                    {
                        $mdDialog.show(
                                $mdDialog.alert()
                                .parent(angular.element(document.querySelector('#vesselcontainer')))
                                .clickOutsideToClose(true)
                                .title('Document Group Added Successfully')
                                .ariaLabel('Alert Dialog Demo')
                                .ok('OK')
                                );
                        $scope.dgname = "";
                        $scope.dgdesc = "";
                        $scope.addDocGroup = false;
                        $scope.getDocGroup(categoryid, areaname, categoryname);


                    }
                    , function (error)
                    {

                        $mdDialog.show(
                                $mdDialog.alert()
                                .parent(angular.element(document.querySelector('#vesselcontainer')))
                                .clickOutsideToClose(true)
                                .title("An Error Occured. Please retry with a Unique Document Group Name")
                                .ariaLabel('Alert Dialog Demo')
                                .ok('OK')
                                );
                        $scope.isDisabled = false;


                    });

                }

            };

            $scope.cancel = function ()
            {
                $scope.addDocGroup = false;
                $scope.dgname = "";
                $scope.dgdesc = "";
            };


        };

        //add new vessel
        $scope.addVessel = function ()
        {

            $scope.selectvessel = false;
            $scope.areasection = false;
            $scope.managearea = false;
            $scope.managecategory = false;
            $scope.managedocgroup = false;
            $scope.managevessel = false;

            $scope.onvesselchange = false;
            $scope.oncategoryclick = false;
            $scope.ondocgroupclick = false;
            $scope.onvesselstab = true;

            $scope.addVessels = true;
            $scope.addArea = false;
            $scope.addCategory = false;
            $scope.addDocGroup = false;
            $scope.addDocument = false;

            $scope.EditArea = false;
            $scope.EditCategory = false;
            $scope.EditDocGroup = false;
            $scope.EditPicture = false;
            $scope.EditVesselsInfo = false;
            $scope.editDocument = false;

            $scope.vname = "";
            $scope.vdesc = "";
            $scope.types = "";
            $scope.owner = "";
            $scope.captain = "";
            $scope.inspector = "";
            $scope.vfile = "";
            document.getElementById("filename").value = "";

            $scope.isDisabled = false;
            restGetCompanyList.getCompany({
                token: auth,
                login: user},
                    function (response) {

                        $scope.vesselsowners = response.shipowner;
                    },
                    function (error)
                    {
                        $mdDialog.show(
                                $mdDialog.alert()
                                .parent(angular.element(document.querySelector('#vesselcontainer')))
                                .clickOutsideToClose(true)
                                .title('Unable to load Ship Owners')
                                .ariaLabel('Alert Dialog Demo')
                                .ok('OK')
                                );
                    });



                    
            $scope.loadUsersinGroup = function (ownerid)
            {
                $scope.selectedshipownerid = ownerid.id;

                restGetUsersListbyGroupbyShipOwner.getUserbyGroupbyOwner({
                    token: auth,
                    login: user, group: "Captain", companyid: $scope.selectedshipownerid},
                        function (response) {

                            $scope.vesselscaptains = response.user;
                            console.log(JSON.stringify($scope.vesselscaptains));
                        },
                        function (error)
                        {
                         var failure = error.data.message.toString();
                            if(failure === "There is no Users in the group Captain")
                            {
                                 $scope.vesselscaptains = null;
                            }
                            else
                            {
                            $mdDialog.show(
                                    $mdDialog.alert()
                                    .parent(angular.element(document.querySelector('#vesselcontainer')))
                                    .clickOutsideToClose(true)
                                    .title('Unable to load Captains')
                                    .ariaLabel('Alert Dialog Demo')
                                    .ok('OK')
                                    );
                        }
                        });
                restGetUsersListbyGroupbyShipOwner.getUserbyGroupbyOwner({
                    token: auth,
                    login: user, group: "Inspector", companyid: $scope.selectedshipownerid},
                        function (response) {

                            $scope.vesselsinspector = response.user;
                        },
                        function (error)
                          {
                         var failure = error.data.message.toString();
                            if(failure === "There is no Users in the group Inspector")
                            {
                                $scope.vesselsinspector = null;
                            }
                            else
                            {
                            $mdDialog.show(
                                    $mdDialog.alert()
                                    .parent(angular.element(document.querySelector('#vesselcontainer')))
                                    .clickOutsideToClose(true)
                                    .title('Unable to load Inspectors')
                                    .ariaLabel('Alert Dialog Demo')
                                    .ok('OK')
                                    );
                        }
                        });

            };

            restGetVesselType.vesselType({
                token: auth,
                login: user},
                    function (response) {

                        $scope.vesselstypes = response.type;
                        $scope.vesselstypes.push({name: "New Vessel Type"});
                    },
                    function (error)
                    {
                        $scope.vesselstypes = {};

                        var failure = error.data.message.toString();

                        if (failure === "There is no vessel types ")
                        {
                            $scope.vesselstypes = [{name: "New Vessel Type"}];
                        }

                    });
//
//            //getlist of VesselTypes
//            $scope.vesselstypes = [
//                {name: 'Cruise'},
//                {name: 'Fishing'},
//                {name: 'PSV'}
//
//            ];
            $scope.displaynewvesseltype = function ()
            {
                $scope.onothersvesseltype = false;
                $scope.newvesselstypes = $scope.types;
                if ($scope.newvesselstypes.name === "New Vessel Type")
                {
                    $scope.onothersvesseltype = true;
                }
            };

            //createvessel
            $scope.savevessel = function (typesname, ownerid, ownername, captainname, inspectorname)
            {
                $scope.isDisabled = true;
                if (typesname == null)
                {
                    $mdDialog.show(
                            $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#vesselcontainer')))
                            .clickOutsideToClose(true)
                            .title('Please select the Vessel Type')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('OK')
                            );
                    $scope.isDisabled = false;
                }
                if ($scope.ovesseltype !== "" && $scope.onothersvesseltype === true)
                {
                    typesname = $scope.ovesseltype;
                    restAddNewVesselTye.addNewVesselType({token: auth, login: user, type: typesname}, function (response)
                    {

                    }, function (error)
                    {

                        $mdDialog.show(
                                $mdDialog.alert()
                                .parent(angular.element(document.querySelector('#vesselcontainer')))
                                .clickOutsideToClose(true)
                                .title('Unable to create New Vessel Type. Please check Vessel Name')
                                .ariaLabel('Alert Dialog Demo')
                                .ok('OK')
                                );
                    });
                }

                if ($scope.vname == "")
                {
                    $mdDialog.show(
                            $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#vesselcontainer')))
                            .clickOutsideToClose(true)
                            .title('Please enter the vessel name')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('OK')
                            );
                    $scope.isDisabled = false;
                }
                if (captainname == null)
                {
                    captainname = "";
                }
                if (inspectorname == null)
                {
                    inspectorname = "";
                }
                if ($scope.vdesc == "")
                {
                    $scope.vdesc = "";
                }
                if ($scope.vfile == "")
                {
                    $mdDialog.show(
                            $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#vesselcontainer')))
                            .clickOutsideToClose(true)
                            .title('Please Upload the Vessel Picture')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('OK')
                            );
                    $scope.isDisabled = false;
                }

                if (typesname != null && $scope.vname != "" && $scope.vfile != "")
                {

                    $scope.myjson = {
                        token: auth,
                        login: user, name: $scope.vname, type: typesname,
                        owner: ownerid, captain: captainname,
                        inspector: inspectorname, description: $scope.vdesc
                    };


                    var fc = new FormData();
                    $scope.vesselpic = $scope.vfile;
                    fc.append('myjson', JSON.stringify($scope.myjson));
                    fc.append('file', $scope.vesselpic);

                    restAddVessel.createVessel(fc,
                            function (response)
                            {

                                $mdDialog.show(
                                        $mdDialog.alert()
                                        .parent(angular.element(document.querySelector('#vesselcontainer')))
                                        .clickOutsideToClose(true)
                                        .title('New Vessel has been created Successfully')
                                        .ariaLabel('Alert Dialog Demo')
                                        .ok('OK')
                                        );
                                restAddListofAreas.addPredefinedAreas({token: auth, login: user, name: $scope.vname, type: "ANY"},
                                        function (response)
                                        {

                                            $scope.vname = " ";
                                            $scope.vdesc = " ";
                                            $scope.types = "";
                                            $scope.owner = "";
                                            $scope.captain = "";
                                            $scope.inspector = "";
                                            $scope.vfile = "";
                                            document.getElementById("filename").value = "";
                                            location.reload();
                                        }, function (error)
                                {

                                    $mdDialog.show(
                                            $mdDialog.alert()
                                            .parent(angular.element(document.querySelector('#vesselcontainer')))
                                            .clickOutsideToClose(true)
                                            .title('Unable to add the Categories')
                                            .ariaLabel('Alert Dialog Demo')
                                            .ok('OK')
                                            );
                                });

                            },
                            function (error)
                            {

                                $mdDialog.show(
                                        $mdDialog.alert()
                                        .parent(angular.element(document.querySelector('#vesselcontainer')))
                                        .clickOutsideToClose(true)
                                        .title('An Error Occured. Please retry with Unique Vessel Name')
                                        .ariaLabel('Alert Dialog Demo')
                                        .ok('OK')
                                        );
                                $scope.isDisabled = false;
                            });
                }
            };

            $scope.cancel = function ()
            {
                $scope.vname = "";
                $scope.vdesc = "";
                $scope.types = "";
                $scope.owner = "";
                $scope.captain = "";
                $scope.inspector = "";
                $scope.vfile = "";
                location.reload();
            };

        };

        //add document to docgroup
        $scope.addnewdocument = function (docgroupid, docgroupname)
        {
            $scope.isDisabled = false;
            document.getElementById("filename1").value = "";
            $scope.ddesc = "";

            $scope.oncategoryclick = false;
            $scope.ondocgroupclick = false;

            $rootScope.docgroupid = docgroupid;
            $rootScope.docgroupname = docgroupname;

            $scope.addArea = false;
            $scope.addCategory = false;
            $scope.addDocGroup = false;
            $scope.addDocument = true;
            $scope.addVessels = false;

            $scope.EditArea = false;
            $scope.EditCategory = false;
            $scope.EditDocGroup = false;
            $scope.EditPicture = false;
            $scope.EditVesselsInfo = false;
            $scope.editDocument = false;

            $scope.saveDoc = function ()
            {
                $scope.isDisabled = true;
                if ($scope.myfile == null)
                {
                    $mdDialog.show(
                            $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#vesselcontainer')))
                            .clickOutsideToClose(true)
                            .title('Please upload the document')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('OK')
                            );
                    $scope.isDisabled = false;
                }
                if ($scope.ddesc == "")
                {
                    $mdDialog.show(
                            $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#vesselcontainer')))
                            .clickOutsideToClose(true)
                            .title('Please enter the Document Description')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('OK')
                            );
                    $scope.isDisabled = false;
                }
                if ($scope.myfile != null && $scope.ddesc != "")
                {
                    $scope.myjson = {
                        token: auth,
                        login: user,
                        parentid: $scope.docgroupid,
                        description: $scope.ddesc
                    };


                    var fd = new FormData();
                    $scope.files = $scope.myfile;

                    fd.append('myjson', JSON.stringify($scope.myjson));
                    fd.append('file', $scope.myfile);

                    restAddNewDocument.addDoc(fd,
                            function (response)
                            {

                                var confirm = $mdDialog.confirm()
                                        .title('Document Uploaded')
                                        .textContent('Document has been saved successfully!!')
                                        .ariaLabel('Saved')
                                        .ok('OK');

                                $mdDialog.show(confirm).then(function () {
                                    $scope.ddesc = "";

                                    document.getElementById("filename1").value = "";
                                    $scope.addDocument = false;
                                    $scope.getDocGroup($rootScope.categoryid, $rootScope.areaname, $rootScope.categoryname);
                                });


                            }
                    , function (error)
                    {
                        var failure = error.data.message;
                        $mdDialog.show(
                                $mdDialog.alert()
                                .parent(angular.element(document.querySelector('#vesselcontainer')))
                                .clickOutsideToClose(true)
                                .title("An Error Occured. Please retry later")
                                .ariaLabel('Alert Dialog Demo')
                                .ok('OK')
                                );
                        $scope.dname = "";
                        $scope.ddesc = "";
                        $scope.isDisabled = false;

                    });
                }
            };
            $scope.cancel = function ()
            {
                $scope.addDocument = false;
                $scope.dname = "";
                $scope.ddesc = "";
                $scope.myfile = "";
                document.getElementById("filename1").value = "";
                $scope.getDocGroup($rootScope.categoryid, $rootScope.areaname, $rootScope.categoryname);
            };



        };

        //delete Area 
        $scope.deleteArea = function (vesselid, areaid)
        {
            $scope.parentid = areaid;
            var confirm = $mdDialog.confirm()
                    .title('Delete Area')
                    .textContent('Are You Sure You Want to Delete the Category & its Details?')
                    .ariaLabel('Saved')
                    .ok('YES')
                    .cancel('NO');

            $mdDialog.show(confirm).then(function () {
                restDeleteTree.deleteTree({token: auth,
                    login: user,
                    id: $scope.parentid}, function (response)
                {
                    $mdDialog.show(
                            $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#vesselcontainer')))
                            .clickOutsideToClose(true)
                            .title('Deleted Successfully')
                            .textContent("The Area is Deleted")
                            .ariaLabel('Alert Dialog Demo')
                            .ok('OK')
                            );
                    $scope.loadArea(vesselid);
                }, function (error)
                {

                    $mdDialog.show(
                            $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#vesselcontainer')))
                            .clickOutsideToClose(true)
                            .title('Unable to Delete')
                            .textContent("Please retry later")
                            .ariaLabel('Alert Dialog Demo')
                            .ok('OK')
                            );
                });


            }, function (cancel) {

            });
        };

        //delete Category 
        $scope.deleteCategory = function (areaid, categoryid)
        {
            $scope.parentid = categoryid;
            var confirm = $mdDialog.confirm()
                    .title('Delete Category')
                    .textContent('Are You Sure You Want to Delete the Sub Category & its Details?')
                    .ariaLabel('Saved')
                    .ok('YES')
                    .cancel('NO');

            $mdDialog.show(confirm).then(function () {
                restDeleteTree.deleteTree({token: auth,
                    login: user,
                    id: $scope.parentid}, function (response)
                {
                    $mdDialog.show(
                            $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#vesselcontainer')))
                            .clickOutsideToClose(true)
                            .title('Deleted Successfully')
                            .textContent("The Category is Deleted")
                            .ariaLabel('Alert Dialog Demo')
                            .ok('OK')
                            );
                    $scope.loadCategory(areaid);
                }, function (error)
                {

                    $mdDialog.show(
                            $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#vesselcontainer')))
                            .clickOutsideToClose(true)
                            .title('Unable to Delete')
                            .textContent("Please retry later")
                            .ariaLabel('Alert Dialog Demo')
                            .ok('OK')
                            );
                });


            }, function (cancel) {

            });
        };

        //delete DocGroup
        $scope.deleteDocGroup = function (docgroupid)
        {
            $scope.parentid = docgroupid;

            var confirm = $mdDialog.confirm()
                    .title('Delete Document Group')
                    .textContent('Are You Sure You Want to Delete the DocGroup & its details')
                    .ariaLabel('Saved')
                    .ok('YES')
                    .cancel('NO');

            $mdDialog.show(confirm).then(function () {
                restDeleteTree.deleteTree({token: auth,
                    login: user,
                    id: $scope.parentid}, function (response)
                {
                    $mdDialog.show(
                            $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#vesselcontainer')))
                            .clickOutsideToClose(true)
                            .title('Deleted Successfully')
                            .textContent("The Document Group is Deleted")
                            .ariaLabel('Alert Dialog Demo')
                            .ok('OK')
                            );
                    $scope.getDocGroup($rootScope.categoryid, $rootScope.areaname, $rootScope.categoryname);
                }, function (error)
                {

                    $mdDialog.show(
                            $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#vesselcontainer')))
                            .clickOutsideToClose(true)
                            .title('Unable to Delete')
                            .textContent("Please retry later")
                            .ariaLabel('Alert Dialog Demo')
                            .ok('OK')
                            );
                });


            }, function (cancel) {

            });
        };

        //delete Vessel
        $scope.deleteVessel = function (vesselid, vesselname)
        {
            $scope.parentid = vesselid;
            $scope.vesselname = vesselname;

            var confirm = $mdDialog.confirm()
                    .title('Delete Vessel')
                    .textContent('Are You Sure You Want to Delete the Vessel Completely??')
                    .ariaLabel('Saved')
                    .ok('YES')
                    .cancel('NO');

            $mdDialog.show(confirm).then(function () {
                restDeleteVessel.deleteVessel({token: auth,
                    login: user, vesselname: $scope.vesselname,
                    id: $scope.parentid}, function (response)
                {
                    $mdDialog.show(
                            $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#vesselcontainer')))
                            .clickOutsideToClose(true)
                            .title('Deleted Successfully')
                            .textContent("The Vessel is Deleted")
                            .ariaLabel('Alert Dialog Demo')
                            .ok('OK')
                            );
                    location.reload();
                }, function (error)
                {

                    $mdDialog.show(
                            $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#vesselcontainer')))
                            .clickOutsideToClose(true)
                            .title('Unable to Delete')
                            .textContent("Please retry later")
                            .ariaLabel('Alert Dialog Demo')
                            .ok('OK')
                            );
                });


            }, function (cancel) {

            });
        };

        //edit Area
        $scope.editArea = function (vesselid, areaid, areaname, areadesc)
        {
            $scope.eaname = areaname;
            if (areadesc === "null")
            {
                $scope.eadesc = "";
            } else
            {
                $scope.eadesc = areadesc;
            }

            $scope.oncategoryclick = false;
            $scope.ondocgroupclick = false;

            $scope.addArea = false;
            $scope.addCategory = false;
            $scope.addDocGroup = false;
            $scope.addVessels = false;
            $scope.addDocument = false;

            $scope.EditArea = true;
            $scope.EditCategory = false;
            $scope.EditDocGroup = false;
            $scope.EditPicture = false;
            $scope.EditVesselsInfo = false;
            $scope.editDocument = false;
            $scope.isDisabled = false;
            $scope.updateArea = function ()
            {
                $scope.isDisabled = true;
                if ($scope.eadesc == "")
                {
                    $scope.eadesc = "";
                }

                if ($scope.eaname == null)
                {
                    $mdDialog.show(
                            $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#vesselcontainer')))
                            .clickOutsideToClose(true)
                            .title('Please enter Category Name')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('OK')
                            );
                    $scope.isDisabled = false;
                }
                if ($scope.eaname != "")
                {
                    restEditTree.editTree({token: auth,
                        login: user, id: areaid, name: $scope.eaname, description: $scope.eadesc}, function (response)
                    {
                        $mdDialog.show(
                                $mdDialog.alert()
                                .parent(angular.element(document.querySelector('#vesselcontainer')))
                                .clickOutsideToClose(true)
                                .title('Category Updated Successfully')
                                .ariaLabel('Alert Dialog Demo')
                                .ok('OK')
                                );
                        $scope.eaname = "";
                        $scope.eadesc = "";
                        $scope.loadArea(vesselid);


                    }
                    , function (error)
                    {

                        $mdDialog.show(
                                $mdDialog.alert()
                                .parent(angular.element(document.querySelector('#vesselcontainer')))
                                .clickOutsideToClose(true)
                                .title("An Error Occured. Please retry with a Unique Category Name")
                                .ariaLabel('Alert Dialog Demo')
                                .ok('OK')
                                );
                        $scope.isDisabled = false;

                    });

                }

            };

            $scope.cancel = function ()
            {
                $scope.EditArea = false;
                $scope.eaname = "";
                $scope.eadesc = "";
            };


        };

        //edit category
        $scope.editCategory = function (areaid, categoryid, categoryname, categorydescription)
        {
            $scope.ecname = categoryname;
            if (categorydescription === "null")
            {
                $scope.ecdesc = "";
            } else
            {
                $scope.ecdesc = categorydescription;
            }


            $scope.oncategoryclick = false;
            $scope.ondocgroupclick = false;

            $scope.addArea = false;
            $scope.addCategory = false;
            $scope.addDocGroup = false;
            $scope.addDocument = false;
            $scope.addVessels = false;

            $scope.EditArea = false;
            $scope.EditCategory = true;
            $scope.EditDocGroup = false;
            $scope.EditPicture = false;
            $scope.EditVesselsInfo = false;
            $scope.editDocument = false;
            $scope.isDisabled = false;
            $scope.updateCategory = function ()
            {
                $scope.isDisabled = true;
                if ($scope.ecdesc == "")
                {
                    $scope.ecdesc = "";
                }
                if ($scope.ecname == "")
                {
                    $mdDialog.show(
                            $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#vesselcontainer')))
                            .clickOutsideToClose(true)
                            .title('Please enter Sub Category Name')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('OK')
                            );
                    $scope.isDisabled = false;
                }
                if ($scope.ecname != "")
                {
                    restEditTree.editTree({token: auth,
                        login: user, id: categoryid, name: $scope.ecname, description: $scope.ecdesc}, function (response)
                    {

                        $mdDialog.show(
                                $mdDialog.alert()
                                .parent(angular.element(document.querySelector('#vesselcontainer')))
                                .clickOutsideToClose(true)
                                .title('New Sub Category Updated Successfully')
                                .ariaLabel('Alert Dialog Demo')
                                .ok('OK')
                                );
                        $scope.ecname = "";
                        $scope.ecdesc = "";
                        $scope.loadCategory(areaid);



                    }
                    , function (error)
                    {

                        $mdDialog.show(
                                $mdDialog.alert()
                                .parent(angular.element(document.querySelector('#vesselcontainer')))
                                .clickOutsideToClose(true)
                                .title("An Error Occured. Please retry with a Unique Sub Category Name")
                                .ariaLabel('Alert Dialog Demo')
                                .ok('OK')
                                );

                        $scope.isDisabled = false;
                    });

                }

            };

            $scope.cancel = function ()
            {
                $scope.EditCategory = false;
                $scope.ecname = "";
                $scope.ecdesc = "";
            };

        };

        //edit new document group
        $scope.editDocgroup = function (docgroupid, docgroupname, docgroupdescription)
        {

            $scope.edgname = docgroupname;
            $scope.edgdesc = docgroupdescription;
            if (docgroupdescription === "null")
            {
                $scope.edgdesc = "";
            } else
            {
                $scope.edgdesc = docgroupdescription;
            }
            $scope.oncategoryclick = false;
            $scope.ondocgroupclick = false;
            $scope.addArea = false;
            $scope.addCategory = false;
            $scope.addDocGroup = false;
            $scope.addVessels = false;
            $scope.addDocument = false;

            $scope.EditArea = false;
            $scope.EditCategory = false;
            $scope.EditDocGroup = true;
            $scope.EditPicture = false;
            $scope.EditVesselsInfo = false;
            $scope.editDocument = false;
            $scope.isDisabled = false;
            $scope.updateDocGroup = function ()
            {
                $scope.isDisabled = true;
                $scope.categoryid = $rootScope.categoryid;
                if ($scope.edgdesc == "")
                {
                    $scope.edgdesc = "";
                }
                if ($scope.edgname == "")
                {
                    $mdDialog.show(
                            $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#vesselcontainer')))
                            .clickOutsideToClose(true)
                            .title('Please enter Document Group Name')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('OK')
                            );
                    $scope.isDisabled = false;
                }
                if ($scope.edgname != "")
                {
                    restEditTree.editTree({token: auth,
                        login: user, id: docgroupid, name: $scope.edgname, description: $scope.edgdesc}, function (response)
                    {
                        $mdDialog.show(
                                $mdDialog.alert()
                                .parent(angular.element(document.querySelector('#vesselcontainer')))
                                .clickOutsideToClose(true)
                                .title('Document Group Updated Successfully')
                                .ariaLabel('Alert Dialog Demo')
                                .ok('OK')
                                );
                        $scope.edgname = "";
                        $scope.edgdesc = "";
                        $scope.EditDocGroup = false;
                        $scope.getDocGroup($scope.categoryid, $rootScope.areaname, $rootScope.categoryname);


                    }
                    , function (error)
                    {

                        $mdDialog.show(
                                $mdDialog.alert()
                                .parent(angular.element(document.querySelector('#vesselcontainer')))
                                .clickOutsideToClose(true)
                                .title("An Error Occured. Please retry with a Unique Document Group Name")
                                .ariaLabel('Alert Dialog Demo')
                                .ok('OK')
                                );
                        $scope.isDisabled = false;

                    });

                }

            };

            $scope.cancel = function ()
            {
                $scope.EditDocGroup = false;
                $scope.edgname = "";
                $scope.edgdesc = "";
            };


        };

        //edit Vessel Picture
        $scope.updatePicture = function (vesselname)
        {

            $scope.oncategoryclick = false;
            $scope.ondocgroupclick = false;

            $scope.addArea = false;
            $scope.addCategory = false;
            $scope.addDocGroup = false;
            $scope.addVessels = false;
            $scope.addDocument = false;

            $scope.EditArea = false;
            $scope.EditCategory = false;
            $scope.EditDocGroup = false;
            $scope.EditPicture = true;
            $scope.EditVesselsInfo = false;
            $scope.editDocument = false;
            $scope.isDisabled = false;

            $scope.updatePic = function ()
            {
                $scope.isDisabled = true;
                if ($scope.evfile == null)
                {
                    $mdDialog.show(
                            $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#vesselcontainer')))
                            .clickOutsideToClose(true)
                            .title('Please Upload the New Vessel Picture')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('OK')
                            );
                    $scope.isDisabled = false;
                }
                if ($scope.evfile != null)
                {
                    $scope.myjson = {
                        token: auth,
                        login: user, name: vesselname
                    };

                    var ff = new FormData();
                    $scope.vesselpic = $scope.evfile;
                    ff.append('myjson', JSON.stringify($scope.myjson));
                    ff.append('file', $scope.vesselpic);

                    restEditVesselPicture.editPic(ff,
                            function (response)
                            {
                                $mdDialog.show(
                                        $mdDialog.alert()
                                        .parent(angular.element(document.querySelector('#vesselcontainer')))
                                        .clickOutsideToClose(true)
                                        .title('Vessel Picture Updated Successfully')
                                        .ariaLabel('Alert Dialog Demo')
                                        .ok('OK')
                                        );
                                document.getElementById("efilename").value = "";
                                $scope.changePic(vesselname);
                                $scope.evfile = null;

                            }, function (error)
                    {

                        $mdDialog.show(
                                $mdDialog.alert()
                                .parent(angular.element(document.querySelector('#vesselcontainer')))
                                .clickOutsideToClose(true)
                                .title('An Error Occured. Please retry later')
                                .ariaLabel('Alert Dialog Demo')
                                .ok('OK')
                                );

                        $scope.isDisabled = false;
                    });
                }
            };
            $scope.cancel = function ()
            {
                $scope.EditPicture = false;
                document.getElementById("efilename").value = "";
            };
        };

        //edit Vessel Metadata
        $scope.editvessel = function (vesselname)
        {

            $scope.selectvessel = false;
            $scope.areasection = false;
            $scope.managearea = false;
            $scope.managecategory = false;
            $scope.managedocgroup = false;
            $scope.managevessel = false;

            $scope.onvesselchange = false;
            $scope.oncategoryclick = false;
            $scope.ondocgroupclick = false;

            $scope.addVessels = false;
            $scope.addArea = false;
            $scope.addCategory = false;
            $scope.addDocGroup = false;
            $scope.addDocument = false;

            $scope.EditArea = false;
            $scope.EditCategory = false;
            $scope.EditDocGroup = false;
            $scope.EditPicture = false;
            $scope.EditVesselsInfo = true;
            $scope.editDocument = false;
            $scope.isDisabled = false;

//            $scope.vesselstypes =
//                    [
//                        {name: 'Cruise'},
//                        {name: 'Fishing'},
//                        {name: 'PSV'}
//
//                    ];



            restGetVesselType.vesselType({
                token: auth,
                login: user},
                    function (response) {

                        $scope.vesselstypes = response.type;
                        $scope.vesselstypes.push({name: "New Vessel Type"});
                    },
                    function (error)
                    {
                        $mdDialog.show(
                                $mdDialog.alert()
                                .parent(angular.element(document.querySelector('#vesselcontainer')))
                                .clickOutsideToClose(true)
                                .title('Unable to load Vessel Types')
                                .ariaLabel('Alert Dialog Demo')
                                .ok('OK')
                                );
                    });

            restGetCompanyList.getCompany({
                token: auth,
                login: user},
                    function (response) {

                        $scope.vesselsowners = response.shipowner;
                        
                    },
                    function (error)
                    {
                        $mdDialog.show(
                                $mdDialog.alert()
                                .parent(angular.element(document.querySelector('#vesselcontainer')))
                                .clickOutsideToClose(true)
                                .title('Unable to load Ship Owners')
                                .ariaLabel('Alert Dialog Demo')
                                .ok('OK')
                                );
                    });
             
            $scope.loadUsersinGroup = function (ownerid)
            {
                $scope.selectedshipownerid = ownerid.id;

                restGetUsersListbyGroupbyShipOwner.getUserbyGroupbyOwner({
                    token: auth,
                    login: user, group: "Captain", companyid: $scope.selectedshipownerid},
                        function (response) {

                            $scope.vesselscaptains = response.user;
                            if ($scope.vesselDetails.captain === "null")
                            {
                                
                            }
                            else
                            {
                                 $scope.vesselscaptains.push({login: $scope.vesselDetails.captain});
                            }
                           
                      
                       console.log(JSON.stringify($scope.vesselscaptains));
                        },
                        function (error)
                        {   console.log(JSON.stringify(error));
                             var failure = error.data.message.toString();
                            if(failure === "There is no Users in the group Captain")
                            {
                                $scope.selectedcaptainname = null;
                                $scope.vesselscaptains=null;
                            }
                            else
                            {
                            $mdDialog.show(
                                    $mdDialog.alert()
                                    .parent(angular.element(document.querySelector('#vesselcontainer')))
                                    .clickOutsideToClose(true)
                                    .title('Unable to load Captains')
                                    .ariaLabel('Alert Dialog Demo')
                                    .ok('OK')
                                    );
                        }
                        });
                restGetUsersListbyGroupbyShipOwner.getUserbyGroupbyOwner({
                    token: auth,
                    login: user, group: "Inspector", companyid: $scope.selectedshipownerid},
                        function (response) {

                            $scope.vesselsinspector = response.user;
                              
                        },
                        function (error)
                        {
                            var failure = error.data.message.toString();
                            if(failure === "There is no Users in the group Inspector")
                            {
                                $scope.vesselsinspector = null;
                                $scope.selectedinspectorname = null;
                            }
                            else
                            {
                            $mdDialog.show(
                                    $mdDialog.alert()
                                    .parent(angular.element(document.querySelector('#vesselcontainer')))
                                    .clickOutsideToClose(true)
                                    .title('Unable to load Inspectors')
                                    .ariaLabel('Alert Dialog Demo')
                                    .ok('OK')
                                    );
                        }
                        });

            };


            restGetVesselDetailsbyID.getVesselDetails
                    ({token: auth, login: user, name: vesselname}, function (response)
                    {

                        var vesselDetails = response;
                        $scope.vesselDetails = response;
                        $scope.evname = vesselDetails.name;

                        if (vesselDetails.description === "null")
                        {
                            $scope.vdesc = "";
                        } else
                        {
                            $scope.vdesc = vesselDetails.description;
                        }


                        $scope.selectedtypename = {name: vesselDetails.type.toString()};
                        $scope.selectedownername = {id: vesselDetails.companyid, name: vesselDetails.owner.toString()};
                       
                        
                        if($scope.selectedownername.id !== null)
                        {
                           
                            $scope.loadUsersinGroup($scope.selectedownername);
                        }


                        $scope.selectedcaptainname = {login: vesselDetails.captain.toString()};
                      
                        
                        $scope.selectedinspectorname = {login: vesselDetails.inspector.toString()};
                       
                    }, function (error)
                    {

                        $mdDialog.show(
                                $mdDialog.alert()
                                .parent(angular.element(document.querySelector('#vesselcontainer')))
                                .clickOutsideToClose(true)
                                .title('Unable to Load Vessel Details')
                                .textContent("Please retry later")
                                .ariaLabel('Alert Dialog Demo')
                                .ok('OK')
                                );
                        location.reload();
                    });
            $scope.displaynewvesseltype = function ()
            {
                $scope.eonothersvesseltype = false;
                $scope.newvesselstypes = $scope.selectedtypename;

                if ($scope.newvesselstypes.name === "New Vessel Type")
                {
                    $scope.eonothersvesseltype = true;
                }
            };
            //update vessel
            $scope.updateVesselInfo = function (typesname, ownerid, ownername, captainname, inspectorname)
            {

                $scope.isDisabled = true;
                if (typesname == null)
                {
                    $mdDialog.show(
                            $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#vesselcontainer')))
                            .clickOutsideToClose(true)
                            .title('Please select the Vessel Type')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('OK')
                            );
                    $scope.isDisabled = false;
                }
                if (ownername == null)
                {
                    $mdDialog.show(
                            $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#vesselcontainer')))
                            .clickOutsideToClose(true)
                            .title('Please select the Ship Owner Company')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('OK')
                            );
                    $scope.isDisabled = false;
                }
                if ($scope.eovesseltype !== "" && $scope.eonothersvesseltype === true)
                {
                    typesname = $scope.eovesseltype;
                    restAddNewVesselTye.addNewVesselType({token: auth, login: user, type: typesname}, function (response)
                    {

                    }, function (error)
                    {

                        $mdDialog.show(
                                $mdDialog.alert()
                                .parent(angular.element(document.querySelector('#vesselcontainer')))
                                .clickOutsideToClose(true)
                                .title('Unable to create New Vessel Type. Please check the Vessel Type Name')
                                .ariaLabel('Alert Dialog Demo')
                                .ok('OK')
                                );
                    });
                }

                if (captainname == null)
                {
                    captainname = "";
                }
                if (inspectorname == null)
                {
                    inspectorname = "";
                }


                if (typesname != null && $scope.evname != "")
                {
                    restEditVesselData.editVesselDetailsData
                            ({token: auth,
                                login: user, name: $scope.evname, type: typesname,
                                owner: ownerid, captain: captainname,
                                inspector: inspectorname, description: $scope.vdesc
                            }, function (response)
                            {

                                $mdDialog.show(
                                        $mdDialog.alert()
                                        .parent(angular.element(document.querySelector('#vesselcontainer')))
                                        .clickOutsideToClose(true)
                                        .title('Vessel has been Updated Successfully')
                                        .ariaLabel('Alert Dialog Demo')
                                        .ok('OK')
                                        );
                                $scope.evname = "";
                                $scope.vdesc = "";
                                $scope.selectedtypename = "";
                                $scope.selectedownername = "";
                                $scope.selectedcaptainname = "";
                                $scope.selectedinspectorname = "";
                                location.reload();
                            },
                                    function (error)
                                    {

                                        $mdDialog.show(
                                                $mdDialog.alert()
                                                .parent(angular.element(document.querySelector('#vesselcontainer')))
                                                .clickOutsideToClose(true)
                                                .title('An Error Occured. Please try again later')
                                                .ariaLabel('Alert Dialog Demo')
                                                .ok('OK')
                                                );
                                        $scope.isDisabled = false;
                                    }
                            );
                }
            };

            $scope.cancel = function ()
            {
                $scope.evname = "";
                $scope.vdesc = "";
                $scope.selectedtypename = "";
                $scope.selectedownername = "";
                $scope.selectedcaptainname = "";
                $scope.selectedinspectorname = "";
                location.reload();
            };
        };

        //edit document 
        $scope.reloadDoc = function (docid, desc)
        {
            $scope.oncategoryclick = false;
            $scope.ondocgroupclick = false;
            $scope.addVessels = false;
            $scope.addArea = false;
            $scope.addCategory = false;
            $scope.addDocGroup = false;
            $scope.addDocument = false;

            $scope.EditArea = false;
            $scope.EditCategory = false;
            $scope.EditDocGroup = false;
            $scope.EditPicture = false;
            $scope.EditVesselsInfo = false;
            $scope.editDocument = true;

            $scope.eddesc = desc;
            $scope.isDisabled = false;
            $scope.emyfile = "";

            $scope.updateDoc = function ()
            {
                $scope.isDisabled = true;
                if ($scope.emyfile == "")
                {
                    $mdDialog.show(
                            $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#vesselcontainer')))
                            .clickOutsideToClose(true)
                            .title('Please upload the document')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('OK')
                            );
                    $scope.isDisabled = false;
                }
                if ($scope.eddesc == "")
                {
                    $mdDialog.show(
                            $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#vesselcontainer')))
                            .clickOutsideToClose(true)
                            .title('Please enter the Document Description')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('OK')
                            );
                    $scope.isDisabled = false;
                }
                if ($scope.emyfile != "" && $scope.eddesc !== "")
                {
                    $scope.myjson = {
                        token: auth,
                        login: user,
                        id: docid,
                        description: $scope.eddesc
                    };

                    var fd = new FormData();
                    $scope.files = $scope.emyfile;

                    fd.append('myjson', JSON.stringify($scope.myjson));
                    fd.append('file', $scope.files);

                    restEditDoc.editDoc(fd,
                            function (response)
                            {

                                var confirm = $mdDialog.confirm()
                                        .title('Document Reloaded')
                                        .textContent('Document has been Updated successfully!!')
                                        .ariaLabel('Saved')
                                        .ok('OK');

                                $mdDialog.show(confirm).then(function () {
                                    $scope.eddesc = "";
                                    $scope.emyfile = null;
                                    document.getElementById("emyfile").value = "";
                                    $scope.editDocument = false;
                                    $scope.getDocGroup($scope.categoryid, $rootScope.areaname, $rootScope.categoryname);
                                });


                            }
                    , function (error)
                    {
                        var failure = error.data.message;

                        $mdDialog.show(
                                $mdDialog.alert()
                                .parent(angular.element(document.querySelector('#vesselcontainer')))
                                .clickOutsideToClose(true)
                                .title("An Error Occured while updating document. Please try again later")
                                .ariaLabel('Alert Dialog Demo')
                                .ok('OK')
                                );
                        $scope.eddesc = "";
                        $scope.isDisabled = false;
                        $scope.myfile = null;
                        document.getElementById("filename1").value = "";
                    });
                }
            };

            $scope.cancel = function ()
            {
                $scope.editDocument = false;
                $scope.eddesc = "";
                $scope.myfile = null;
                document.getElementById("filename1").value = "";
                $scope.getDocGroup($scope.categoryid, $rootScope.areaname, $rootScope.categoryname);

            };
        };




    }]);

