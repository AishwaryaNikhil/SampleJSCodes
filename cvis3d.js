var cvisHome = angular.module('cvisApplication.cvis3dPage', []);
cvisHome.controller('cvis3dController', ['$scope', '$http', '$location', '$window', '$rootScope',
    'restgetFolder', 'restAddNewNote', 'restgetAllNotes', 'restDeleteNotes',
    function ($scope, $http, $location, $window, $rootScope, restgetFolder, restAddNewNote, restgetAllNotes, restDeleteNotes)
    {

        console.log("CVIS 3d Controller Started");
        var cookieprojid = getCookieRootProjId("rootprojid");
        var cookieprojname = getCookieRootProjName("rootprojname");
        //var cookiesubfolderid = getCookieSubFolderid("subfolderid");
        //var cookiesubfoldername = getCookieSubFolderName("subfoldername");
        var data;
        var selectednodeid;
        var flag = true;
        var prevselectednodeid = "a";
        $rootScope.$on("callget3DMethod", function (event, args) {
            var selectednodeid;
            var flag = true;
            var prevselectednodeid = "a";
            var projname = args.projname;
            var projid = args.projid;
            //$scope.getFoldersList(projid, projname);
        });

        $scope.load3dPage = function ()
        {
            $scope.getFoldersList(cookieprojid, cookieprojname);
            var selectednodeid;
            var flag = true;
            var prevselectednodeid = "a";
        };

        $scope.getFoldersList = function (projid, projname)
        {
            var cookietoken = getCookieToken("token");
            restgetFolder.getFolders({token: cookietoken, id: projid}, function (response)
            {

                data = response.children;
                console.log(JSON.stringify(data));
                //eachRecursive(data);
                loadjstree();
                eachRecursive(data);

                document.getElementById("undoHide").disabled = true;
                
            }, function (error)
            {
                console.log(JSON.stringify(error));
            });
        };

        $scope.loadNotes = function ()
        {
            var cookieprojid = getCookieRootProjId("rootprojid");
            var cookieprojname = getCookieRootProjName("rootprojname");
            var cookietoken = getCookieToken("token");
            restgetAllNotes.getAllNotes({token: cookietoken, parent_id: cookieprojid}, function (response)
            {
                console.log(JSON.stringify(response));
                $scope.NotesList = response.note;
//                for (var i=0; i< $scope.NotesList.length; i++)
//                {
//                    var notestitle = $scope.NotesList[i].title;
//                    alert(notestitle);
//                }
//                

            }, function (error)
            {
                console.log(JSON.stringify(error));
            });

        };

        var viewNoteflag = "false";
        var prevselectednoteid = "a";
        $scope.viewNotes = function ($event, noteslist)
        {
            showNote($event.target.checked, noteslist);

        };

        var viewallnotesflag = "false";
        $scope.viewAllNotes = function ($event)
        {
            var cookieprojid = getCookieRootProjId("rootprojid");
            var cookieprojname = getCookieRootProjName("rootprojname");
            var cookietoken = getCookieToken("token");

            restgetAllNotes.getAllNotes({token: cookietoken, parent_id: cookieprojid}, function (response)
            {

                console.log(JSON.stringify(response));
                for (var i = 0; i < $scope.NotesList.length; i++)
                {
                    showNote($event.target.checked, $scope.NotesList[i]);
                }
//                if (viewallnotesflag == "false")
//                {
//                    viewallnotesflag = "true";
//                    $scope.NotesList = response.note;
//                    for (var i = 0; i < $scope.NotesList.length; i++)
//                    {
////                        var parentid = $scope.NotesList[i].parent_id;
////                        var noteid = $scope.NotesList[i].id.toString(); 
////                        var notecontent = $scope.NotesList[i].note_body;
////                        bjsView.setToolTip(parentid, notecontent); 
//                       showNote($event.target.checked, $scope.NotesList[i])
//                    }
//
//                } 
//                else
//                {
//                    viewallnotesflag = "false";
//                    $scope.NotesList = response.note;
//                    for (var i = 0; i < $scope.NotesList.length; i++)
//                    {
//                       var parentid = $scope.NotesList[i].parent_id;
//                        var noteid = $scope.NotesList[i].id; 
//                        var notecontent = $scope.NotesList[i].note_body;
//                        bjsView.setToolTip(parentid, null); 
//                        document.getElementById(noteid).checked = false;
//                    }
//                }



            }, function (error)
            {
                console.log(JSON.stringify(error));
            });
        };


        function showNote(checkboxstatus, noteslists)
        {
            try {
                if (checkboxstatus) {
                    var parentid = noteslists.parent_id;
                    var noteid = noteslists.id.toString();
                    var notecontent = noteslists.note_body;
                    bjsView.setToolTip(parentid, notecontent);
                    noteslists.Selected=true;
                } else {
                    var parentid = noteslists.parent_id;
                    var noteid = noteslists.id.toString();
                    var notecontent = noteslists.note_body;
                    bjsView.setToolTip(parentid, null);
                    noteslists.Selected=false;
                }
            } catch (ex) {
                // something goes wrong
                window.alert(ex);
            }
            ;

        }
        //this will show the detail button
        $scope.Details = true;
        $scope.Notes = true;
        var bjsView = new BjsView();
        bjsView.init("renderCanvas");

        bjsView.createScene();
//        bjsView.setBackGroundColor(255,250,255, 0.5);
        //open/close sidenav
        var treeopen = true;
        $scope.footer = true;

        $scope.openNav = function () {
            document.getElementById("mySidenav").style.width = "250px";
//            document.getElementById("footer").style.marginLeft = "250px";
            document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
            $scope.Details = false;
            $scope.Notes = false;
            $scope.footer = false;
            if (treeopen === true)
            {
                $('#jstree').jstree("check_all");
                treeopen = false;
            }


        };

        $scope.openNav2 = function () {
            document.getElementById("mySidenav1").style.width = "250px";
//            document.getElementById("footer").style.marginLeft = "250px";
            document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
            $scope.Details = false;
            $scope.Notes = false;

            $scope.footer = false;

        };
        $scope.closeNav = function () {
            $scope.footer = true;
            document.getElementById("mySidenav").style.width = "0";
            document.getElementById("main").style.marginLeft = "0";
//                        document.getElementById("footer").style.marginLeft = "0px";
            document.body.style.backgroundColor = "white";
            $scope.Details = true;
            $scope.Notes = true;
        };

        $scope.closeNav2 = function () {

            document.getElementById("mySidenav1").style.width = "0";
            document.getElementById("main").style.marginLeft = "0";
//                        document.getElementById("footer").style.marginLeft = "0px";
            document.body.style.backgroundColor = "white";
            $scope.Details = true;
            $scope.Notes = true;
        };

        //all Tree functions in Jquery. 

        var highlightednode;
        var hiddennodelength;
        var hiddennodeidlength;

        function loadjstree()
        {
            $('#jstree').jstree(
                    {
                        'core': {
                            expand_selected_onload: false,
                            'data': data,
                            "themes": {
                                "icons": false
                            }
                        },
                        "search": {
                            "case_insensitive": true,
                            "show_only_matches": true
                        },
                        "plugins": ["wholerow", "checkbox", "search", "contextmenu"],
                        "checkbox":
                                {
                                    'three_state': false,
                                    'whole_node': false,
                                    'tie_selection': false,
                                    "cascade": "down"
                                }



                    });


            $('#jstree').on('select_node.jstree', function (e, data)
            {
                $('#onnoModel').hide();
                var nodepath = data.node.original.path;

                if (nodepath !== "")
                {
                    if (flag === true)
                    {
                        //bjsView.highlight(data.node.id, true);

                        if (prevselectednodeid !== data.node.id)
                        {
                            var nodeid = data.node.id;
                            var nodeid = parseInt(nodeid);
                            bjsView.highlight(nodeid, true);
                            highlightednode = data.node.id;
                            currentnode = parseInt(data.node.id);
                            flag = false;
                            prevselectednodeid = parseInt(data.node.id);

                        } else
                        {
                            flag = false;
                            highlightednode = data.node.id;
                            currentnode = parseInt(data.node.id);
                            prevselectednodeid = parseInt(data.node.id);
                            bjsView.highlight(prevselectednodeid, false);
                            $('#jstree').jstree("deselect_node", prevselectednodeid);
                        }

                    } else
                    {
                        var newnode = data.node.id;
                        var newnode = parseInt(newnode);
                        if (currentnode === newnode)
                        {
                            bjsView.highlight(newnode, false);
                            flag = true;
                            prevselectednodeid = parseInt(data.node.id);
                            $('#jstree').jstree("deselect_node", data.node.id);
                        } else
                        {
                            bjsView.highlight(newnode, true);
                            highlightednode = parseInt(data.node.id);
                            if (prevselectednodeid !== data.node.id)
                            {
                                $('#jstree').jstree("deselect_node", prevselectednodeid);
                                flag = false;
                                currentnode = parseInt(data.node.id);
                                prevselectednodeid = parseInt(data.node.id);
                            } else
                            {
                                flag = false;
                                currentnode = parseInt(data.node.id);
                                prevselectednodeid = parseInt(data.node.id);
                            }
                        }


                    }
                } else
                {
                    $('#onnoModel').show();
                    bjsView.highlight(highlightednode, false);
                }
            });


            var checkedall = "true";

            $scope.changeScene = function ()
            {
                if (checkedall === "true")
                {
                    $('#jstree').jstree("uncheck_all");
                    checkedall = "false";
//                    bjsView.setOpacityForWholeScene(0.5);
                    bjsView.showAllMeshes(false);

                } else
                {
                    checkedall = "true";
                    $('#jstree').jstree("check_all");
                    bjsView.showAllMeshes(true);
                    for (var i = 0; i < hiddennodes.length; i++)
                    {
                        bjsView.showMesh(hiddennodes[i], true);
                    }

                }
            };



            $('#jstree').on("check_node.jstree", function (e, data) {
                var nodeid = data.node.id;
                var nodeinfo = $('#jstree').jstree(true).get_node(nodeid);
                var path = nodeinfo.original.path;
                if (path === "")
                {
                    $('#onnoModel').show();
                    checkChildren(data.node.id);

                } else
                {
                    checkChildren(data.node.id);
                }


            });

            $('#jstree').on("uncheck_node.jstree", function (e, data)
            {

                var nodeid = data.node.id;
                var nodeinfo = $('#jstree').jstree(true).get_node(nodeid);

                var path = nodeinfo.original.path;
                if (path === "")
                {
                    $('#onnoModel').show();
                    $('#jstree').jstree("uncheck_node", nodeid);
                    uncheckChildren(data.node.id);
                } else
                {

                    uncheckChildren(data.node.id);
                }



            });

            function uncheckChildren(selectednodeid)
            {
                unhideChildren(selectednodeid, data);
            }
            function checkChildren(selectednodeid)
            {
                showCheckedChildren(selectednodeid, data);
            }

        }
        ;


        function unhideChildren(rootparentid, data)
        {
//            alert("called again");
//            alert(rootparentid); 
            if (data == null || data.length == null)
            {
                return;
            }
            for (var i = 0; i < data.length; i++)
            {
                if (rootparentid == data[i].id)
                {
                    bjsView.showMesh(data[i].id, false);
                    $('#onnoModel').hide();
                    hiddennodes[count] = data[i].name;
                    hiddennodeid[count] = data[i].id;
                    count = count + 1;
                    flag = true;
                    document.getElementById("undoHide").disabled = false;
                    var childrennodes = data[i].children;
                    if (childrennodes === undefined)
                    {

                        unhideChildren(rootparentid, data[i].children);
                    } else
                    {
                        var datalength = data[i].children.length;

                        for (var x = 0; x < datalength; x++)
                        {
                            if (childrennodes[x].path !== null && childrennodes[x].path.length > 0)
                            {
                                var childrenid = childrennodes[x].id;

                                unhideChildren(childrenid, childrennodes);
                            }
                        }
                    }

                }


                unhideChildren(rootparentid, data[i].children);

            }

        }
        ;

        function showCheckedChildren(rootparentid, data)
        {

            if (data == null || data.length == null)
            {
                return;
            }
            for (var i = 0; i < data.length; i++)
            {
                if (rootparentid == data[i].id)
                {

                    bjsView.showMesh(data[i].id, true);
                    $('#onnoModel').hide();
                    flag = false;
                    hiddennodelength = hiddennodes.length - 1;
                    hiddennodeidlength = hiddennodeid.length - 1;

                    hiddennodes.splice(hiddennodelength);
                    hiddennodeid.splice(hiddennodeidlength);


                    if (hiddennodes.length === 0 && hiddennodeid.length === 0)
                    {
                        hiddennodes = [];
                        hiddennodeid = [];
                        count = 0;
                        document.getElementById("undoHide").disabled = true;
                    }
                    var childrennodes = data[i].children;
                    if (childrennodes === undefined)
                    {

                        showCheckedChildren(rootparentid, data[i].children);
                    } else
                    {
                        var datalength = data[i].children.length;

                        for (var x = 0; x < datalength; x++)
                        {
                            if (childrennodes[x].path !== null && childrennodes[x].path.length > 0)
                            {
                                var childrenid = childrennodes[x].id;

                                showCheckedChildren(childrenid, childrennodes);
                            }
                        }
                    }

                }


                showCheckedChildren(rootparentid, data[i].children);
            }

        }
        ;
        $scope.enterkeyPressed = function ($event)
        {
            var keyCode = $event.which || $event.keyCode;
            if (keyCode === 13) {
                $scope.searchTree();
            }
            ;
        };

        var prevsearchedstring;
        $scope.searchTree = function ()
        {

            var searchString = $scope.compname;
            if (searchString == undefined || searchString == "")
            {
                bjsView.setOpacityForWholeScene(1);
                bjsView.highlight(prevsearchedstring, false);
//                var color = " ‎32, 178, 170";
                //bjsView.setMeshColor(prevsearchedstring, color);
            } else
            {
                searchinMesh(data, searchString);
            }
        };
        var highlightedmesh = "";

        function searchinMesh(data, searchString1)
        {
            var datafound = "false";
            if (data == null || data.length == null) {
                return;
            }
            for (var i = 0; i < data.length; i++)
            {

                if (data[i].name == searchString1)
                {
                    bjsView.setOpacityForWholeScene(0.5);
                    $('#jstree').jstree("select_node", data[i].id);
                    bjsView.zoomIn(data[i].id);
//                    prevsearchedstring = searchString1;
//                    var color = "255,255,255";
//                    bjsView.setMeshColor(searchString1, color);
//                    bjsView.setMeshColor(highlightedmesh, "32, 178, 170");
                    bjsView.highlight(data[i].id, true);
                    bjsView.setOpacity(data[i].id, 1);
                    highlightedmesh = searchString1;
                    datafound = "true";

                } else
                {
                    searchinMesh(data[i].children, searchString1);
                    if (datafound !== "true" && highlightedmesh !== searchString1)
                    {
                        $('#jstree').jstree("deselect_node", data[i].id);

//                        var color = "32, 178, 170";
//                        bjsView.setMeshColor(highlightedmesh, color);
//                          bjsView.highlight(highlightedmesh, false);
//                        bjsView.setOpacityForWholeScene(0.5);
//                    alert("No such Component Exists!");
//                    return; 
                    }
                }
            }



        }

        //camera Type
        $scope.flyModel = function ()
        {
            bjsView.setCameraAsFree();
            //bjsView.zoomAll();
            document.getElementById("cameraicon").className = "icon-fly";
        };

        $scope.universalModel = function ()
        {
            bjsView.setCameraAsUniversal();
            //bjsView.zoomAll();
            document.getElementById("cameraicon").className = "fa fa-globe";
        };


        $scope.WalkThrough = function ()
        {
            bjsView.setCameraAsWalkThrough();
            //bjsView.zoomAll();
            document.getElementById("cameraicon").className = "icon-walkthrough";
        };

        $scope.cameraCAD = function ()
        {
            bjsView.setCameraAsArcRotate();
            //bjsView.zoomAll();
            document.getElementById("cameraicon").className = "icon-orbit";
        };
        $scope.loadexplorer = function ()
        {
            $window.open("index.html#!/main");
        };


        //axes selection. Selecting Y+, Y- doesnt work
        $scope.axeUpXP = function ()
        {
            bjsView.setLeftView();
        };
        $scope.axeUpXM = function ()
        {
            bjsView.setRightView();
        };
        $scope.axeUpYP = function ()
        {
            bjsView.setFrontView();
        };
        $scope.axeUpYM = function ()
        {
            bjsView.setBackView();
        };
        $scope.axeUpZP = function ()
        {
            bjsView.setTopView();
        };
        $scope.axeUpZM = function ()
        {
            bjsView.setBottomView();
        };


        function eachRecursive(data)
        {
            if (data == null || data.length == null) {
                return;
            }
            for (var i = 0; i < data.length; i++)
            {

                if (data[i].model != null && data[i].model.length > 0)

                {

                    var pathd = data[i].model;
                    var path3dlength = data[i].model.length;
                    if (path3dlength > 0)
                    {
                        for (var x = 0; x < path3dlength; x++)
                        {
                            var modelname = pathd[x].name;
                            var path = pathd[x].path;

                            if (path !== null && path.length > 0)
                            {
                                var params = {};
                                var filetype = modelname.split('.');
                                var ff = filetype[0];
                              params.folderName = "data/_JP_MODULE/" + path;
                                 // params.folderName = "files/" + path;

                                params.fileName = modelname;
                                params.meshName = data[i].id;
                                bjsView.addFileToScene(params);
                                //bjsView.zoomAll();
                            }

                        }

                    }

                }

                eachRecursive(data[i].children);
            }

        }
        ;




        $(function () {
            $(document).on('click', '.alert-close', function () {
                $(this).parent().hide();
            });
        });

        bjsView.setOnDoubleClickPickedMesh(callModal);
        function callModal(nodename)
        {
            $scope.showDocumentsList(nodename);
            console.log(JSON.stringify(nodename));
        }
        ;
        //$scope.showModel = false;
        bjsView.setOnClickPickedMesh(singleClick);


        function singleClick(nodename)
        {

            $scope.singleClickonModel(nodename.name);
        }
        ;
        function getNodeIdbyName(nodename, data)
        {

            if (data == null || data.length == null) {
                return;
            }
            for (var i = 0; i < data.length; i++)
            {

                if (data[i].id === nodename)
                {
                    selectednodeid = data[i].id;

                }
                getNodeIdbyName(nodename, data[i].children);
            }
        }

        $scope.showhidemodel = false;


        $scope.singleClickonModel = function (nodename)
        {
            $scope.showhidemodel = true;
            if (nodename !== "")
            {
                if (flag === true)
                {
                    bjsView.highlight(nodename, true);
                    getNodeIdbyName(nodename, data);
                    if (prevselectednodeid !== selectednodeid)
                    {
                        $('#jstree').jstree("deselect_node", prevselectednodeid);
                        $('#jstree').jstree("select_node", selectednodeid);
                        prevselectednodeid = selectednodeid;
                        flag = false;
                        highlightednode = nodename;
                        currentnode = nodename;
                    } else
                    {
                        $('#jstree').jstree("select_node", selectednodeid);
                        prevselectednodeid = selectednodeid;
                        flag = false;
                        highlightednode = nodename;
                        currentnode = nodename;
                    }


                } else
                {
                    var newnode = nodename;
                    if (currentnode === newnode)
                    {
                        bjsView.highlight(nodename, false);
                        getNodeIdbyName(nodename, data);
                        $('#jstree').jstree("deselect_node", selectednodeid);
                        prevselectednodeid = selectednodeid;
                        flag = true;
                        highlightednode = "";
                    } else
                    {
                        bjsView.highlight(nodename, true);
                        getNodeIdbyName(nodename, data);

                        if (prevselectednodeid !== selectednodeid)
                        {
                            $('#jstree').jstree("deselect_node", prevselectednodeid);
                            $('#jstree').jstree("select_node", selectednodeid);
                            prevselectednodeid = selectednodeid;
                            highlightednode = nodename;
                            flag = false;
                            currentnode = nodename;
                        } else
                        {
                            $('#jstree').jstree("select_node", selectednodeid);
                            prevselectednodeid = selectednodeid;
                            highlightednode = nodename;
                            flag = false;
                            currentnode = nodename;
                        }

                    }


                }
            } else
            {
                bjsView.highlight(highlightednode, false);
            }
        };



        var viewpart = true;
        var hiddennodes = [];
        var count = 0;
        var hiddennodeid = [];


        $scope.hideModel = function ()
        {

            if (viewpart === true && highlightednode !== "")
            {

                bjsView.showMesh(highlightednode, false);
                getNodeIdbyName(highlightednode, data);

                $('#jstree').jstree("deselect_node", selectednodeid);
                $('#jstree').jstree("uncheck_node", selectednodeid);

                var hiddennodelth = hiddennodes.length;
                for (var i = 0; i < hiddennodelth; i++)
                {

                }
            } else
            {
                alert("please select node");
            }

        };



        function syncTreeonHideMesh(highlightednode1, highlightednodeid, data)
        {

            if (data == null || data.length == null) {
                return;
            }
            for (var i = 0; i < data.length; i++)
            {

                if (data[i].name === highlightednode1)
                {
                    $('#jstree').jstree("check_node", highlightednodeid);
                }
                syncTreeonHideMesh(highlightednode1, highlightednodeid, data[i].children);
            }

        }
        ;


        $scope.undoHideModel = function ()
        {
            hiddennodelength = hiddennodes.length - 1;
            hiddennodeidlength = hiddennodeid.length - 1;
            bjsView.showMesh(hiddennodes[hiddennodelength], true);
            syncTreeonHideMesh(hiddennodes[hiddennodelength], hiddennodeid[hiddennodeidlength], data);

        };
        $scope.addNotesPopUp = function ()
        {
            $("#addNoteModal").modal();
            $("#addNoteModal").draggable();

        };

        $scope.saveNotes = function ()
        {
            var cookietoken = getCookieToken("token");
            var notecontent = $scope.noteBody;
//            var notecontent = $scope.noteBody.replace(/(\r\n|\n|\r)/gm, "\\\\n");
//              var notecontent = notecontent.replace(/(\")/gm, "\\\"");
//            //var notecontent = $scope.noteBody.replace(/(\n|\n)/gm, "\\\\n");
//            var notecontent = $scope.noteBody.replace("\"", "\\\"");
            console.log(notecontent);
            $scope.jsondetails = [{token: cookietoken, parent_id: $rootScope.selectedmodelname, title: $scope.noteTitle,
                note_body: notecontent, x: $rootScope.xaxis, y: $rootScope.yaxis, z: $rootScope.zaxis}];
        console.log(JSON.stringify($scope.jsondetails));
            restAddNewNote.addNewNote({token: cookietoken, parent_id: $rootScope.selectedmodelname, title: $scope.noteTitle,
                note_body: notecontent, x: $rootScope.xaxis, y: $rootScope.yaxis, z: $rootScope.zaxis}, function (response)
            {
                console.log(JSON.stringify(response));
                $('#addNoteModal').modal('toggle');
                $scope.noteTitle = null;
                $scope.noteBody = null;
                $scope.loadNotes();

            }, function (error)
            {
                console.log(JSON.stringify(error));
            });

        };


        $scope.deleteNote = function (noteid, parentid)
        {
            var cookieToken = getCookieToken("token");
            $("#delNote").modal();
            $scope.okdelete = function ()
            {
                $("#delNote").modal('hide');
                restDeleteNotes.deleteNotes({token: cookieToken, id: noteid, parent_id: parentid}, function (response)
                {
                    console.log(JSON.stringify(response));
                    $scope.loadNotes();

                }, function (error)
                {
                    console.log(JSON.stringify(error));
                });
            };

        };
        $scope.showDocumentsList = function (nodename)
        {
            $("#docmodal").modal();
            $("#docmodal").draggable();
            $rootScope.$apply(function () {
                $rootScope.selectedmodelname = nodename.name;
                $rootScope.axis = nodename.point;
                console.log(JSON.stringify($rootScope.axis));
                $rootScope.xaxis = $rootScope.axis.x;
                $rootScope.yaxis = $rootScope.axis.y;
                $rootScope.zaxis = $rootScope.axis.z;
                console.log("xaxis" + $rootScope.xaxis);

            });
            $scope.loadDocuments($rootScope.selectedmodelname);
        };
        $scope.onLinkedDocument = function (docid, docname, docpath)
        {
            var filetype = docname.split('.');
            var ff = filetype[1];
            ff = ff.toString();

            if (ff != "fbx" || ff != "obj" || ff != "babylon" || ff != "mtl")
            {
                window.open("http://itekvrsoftware.com/cvis/files/" + docpath + docname);
            } else
            {
                alert("To be opened in 3d Window");
            }

        };

        $scope.loadDocuments = function (nodename) {
            var cookietoken = getCookieToken("token");
            restgetFolder.getFolders({token: cookietoken, id: nodename}, function (response)
            {
                $rootScope.Details = response.children;

                for (var i = 0; i < $rootScope.Details.length; i++)
                {
                    $rootScope.documents = $rootScope.Details[i].doc;

                    $rootScope.modelname = $rootScope.Details[i].name;

//                            for (var x = 0; x < $rootScope.documents.length; x++)
//                    {
//                        $rootScope.filename = $rootScope.documents[x].name;
//                        $rootScope.filetype = $rootScope.filename.split('.');
//                        $rootScope.ff = $rootScope.filetype[1];
//                        if ($rootScope.ff === "doc")
//                        {
//                            $rootScope.type = "file-word-o";
//                        }
//                        if ($rootScope.ff === "pdf")
//                        {
//                            $rootScope.type = "file-pdf-o";
//                        }
//                        if ($rootScope.ff === "jpg" || $rootScope.ff === "png" || $rootScope.ff === "jpeg" || $rootScope.ff === "bmp")
//                        {
//                            $rootScope.type = "file-picture-o";
//                        }
//
//                        if ($rootScope.ff === "mp4" || $rootScope.ff === "mp3" || $rootScope.ff === "avi" || $rootScope.ff === "flv")
//                        {
//                            $rootScope.type = "file-sound-o";
//                        }
//
//
//
//                    }



                }

            }, function (error)
            {
                console.log(JSON.stringify(error));
            });
        };
        $scope.showtxtbx = "false";

        $scope.loadSearch = function ()
        {
            if ($scope.showtxtbx === "false")
            {
                $scope.showsearchbox = true;
                $scope.showtxtbx = "true";
            } else
            {
                $scope.showtxtbx = "false";
                $scope.showsearchbox = false;
            }
        };
        $scope.cameramode = false;

        $scope.showcameramode = function ()
        {
            $scope.axisvalues = false;
            if ($scope.cameramode === false)
            {
                $scope.cameramode = true;
            } else
            {
                $scope.cameramode = false;
            }
        };
        $scope.axisvalues = false;
        $scope.showAxis = function ()
        {
            $scope.cameramode = false;
            if ($scope.axisvalues === false)
            {
                $scope.axisvalues = true;
            } else
            {
                $scope.axisvalues = false;
            }

        };
        $scope.loadHome = function ()
        {
            $location.path('/home');
        };

        $scope.loadMetaData = function ()
        {
            $scope.MetaData = [{"name": "itekVR AS", "value": "22/7/2012"},
                {"name": "ABC", "value": "sgdhf\gsdfj"}, {"name": "ABC", "value": "sgdhf\gsdfj"}];
        };




    }]);

