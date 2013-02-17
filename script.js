// Generated by CoffeeScript 1.3.3
(function() {
  var __slice = [].slice;

  $.fn.tap = function() {
    return this.bind.apply(this, ['click touchend'].concat(__slice.call(arguments)));
  };

  $.fn.spinner = function() {
    return this.each(function(idx, elem) {
      var down, step, up, value;
      elem = $(elem);
      value = $('<span>').text(elem.val());
      up = $('<button>', {
        "class": 'up'
      });
      down = $('<button>', {
        "class": 'down'
      });
      elem.wrap($('<span>', {
        "class": 'spinner'
      })).parent().append(value, up, down);
      step = function(up) {
        return function(evt) {
          evt.preventDefault();
          try {
            if (up) {
              elem[0].stepUp();
            } else {
              elem[0].stepDown();
            }
          } catch (_error) {}
          return elem.change();
        };
      };
      up.tap(step(true));
      down.tap(step(false));
      return elem.change(function() {
        return value.text(elem.val());
      });
    });
  };

  $(document).ready(function() {
    var addPlayer, add_btn, data, place_index, reset_btn, root, save, table, thead, tr, v, _i, _len;
    table = $('<table>').appendTo(document.body);
    table.append($('<col>', {
      id: 'remove'
    }), $('<col>', {
      id: 'name'
    }), $('<col>', {
      id: 'level'
    }), $('<col>', {
      id: 'gear'
    }), $('<col>', {
      id: 'attack'
    }));
    thead = $('<thead>').appendTo(table);
    tr = $('<tr>').appendTo(thead);
    add_btn = $('<button>', {
      "class": 'add'
    }).text('+');
    reset_btn = $('<button>', {
      "class": 'reset'
    }).text('↺');
    tr.append($('<th>', {
      "class": 'add'
    }).append(add_btn), $('<th>').append(reset_btn), $('<th>').text('♥'), $('<th>').text('⚒'), $('<th>').text('⚔'));
    root = $('<tbody>').appendTo(table);
    data = [];
    try {
      data = JSON.parse(window.localStorage['munchkin']);
    } catch (_error) {}
    save = function() {
      var data_k, v, _ref;
      data = data.filter(function(v) {
        return !v.deleted;
      });
      data_k = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          v = data[_i];
          _results.push({
            name: v.name,
            gear: v.gear,
            level: v.level
          });
        }
        return _results;
      })();
      return (_ref = window.localStorage) != null ? _ref['munchkin'] = JSON.stringify(data_k) : void 0;
    };
    place_index = 1;
    addPlayer = function(player) {
      var del_btn, gear, level, name, row, total, update;
      del_btn = $('<button>', {
        "class": 'delete'
      }).text('–');
      name = $('<input>', {
        type: 'text',
        value: player.name,
        placeholder: "Player " + (place_index++)
      });
      level = $('<input>', {
        type: 'number',
        value: player.level,
        step: 1,
        min: 1,
        max: 99
      });
      gear = $('<input>', {
        type: 'number',
        value: player.gear,
        step: 1,
        min: 0,
        max: 999
      });
      total = $('<span>');
      row = $('<tr>');
      root.append(row);
      row.append(del_btn, name, level, gear, total);
      row.children().wrap('<td>');
      update = function() {
        player.name = name.val();
        player.level = +level.val();
        player.gear = +gear.val();
        total.text(player.level + player.gear);
        save();
        return null;
      };
      row.find('input[type=number]').spinner();
      row.find('input').change(update);
      update();
      return del_btn.tap(function(evt) {
        evt.preventDefault();
        player.deleted = true;
        row.remove();
        return save();
      });
    };
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      v = data[_i];
      addPlayer(v);
    }
    add_btn.tap(function(evt) {
      var i;
      evt.preventDefault();
      i = data.push({
        name: null,
        level: 1,
        gear: 0
      }) - 1;
      return addPlayer(data[i]);
    });
    return reset_btn.tap(function(evt) {
      var _j, _len1, _results;
      data = (function() {
        var _j, _len1, _results;
        _results = [];
        for (_j = 0, _len1 = data.length; _j < _len1; _j++) {
          v = data[_j];
          _results.push({
            name: v.name,
            level: 1,
            gear: 0
          });
        }
        return _results;
      })();
      place_index = 1;
      $('tr:not(:first)').remove();
      _results = [];
      for (_j = 0, _len1 = data.length; _j < _len1; _j++) {
        v = data[_j];
        _results.push(addPlayer(v));
      }
      return _results;
    });
  });

}).call(this);
