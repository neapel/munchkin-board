$.fn.tap = ->
	this.bind 'click touchend', arguments...
$.fn.spinner = ->
	@each (idx, elem) ->
		elem = $(elem)
		value = $('<span>').text(elem.val())
		up = $('<button>', {class: 'up'}).text('〉')
		down = $('<button>', {class: 'down'}).text('〈')
		elem.wrap($('<span>', {class: 'spinner'})).parent().append(value, up, down)
		step = (up)-> (evt)->
			evt.preventDefault()
			try if up then elem[0].stepUp() else elem[0].stepDown()
			elem.change()
		up.tap step(true)
		down.tap step(false)
		elem.change -> value.text(elem.val())

$(document).ready ->
	table = $('<table>').appendTo document.body
	table.append(
		$('<col>', {id: 'remove'}),
		$('<col>', {id: 'name'}),
		$('<col>', {id: 'level'}),
		$('<col>', {id: 'gear'}),
		$('<col>', {id: 'attack'}))
	thead = $('<thead>').appendTo table
	tr = $('<tr>').appendTo thead
	add_btn = $('<button>', {class: 'add'}).text('+')
	reset_btn = $('<button>', {class: 'reset'}).text('↺')
	tr.append(
		$('<th>', {class: 'add'}).append(add_btn),
		$('<th>').append(reset_btn),
		$('<th>').text('♥'), # level
		$('<th>').text('⚒'), # gear
		$('<th>').text('⚔')) # attack
	root = $('<tbody>').appendTo table
	data = []
	try data = JSON.parse(window.localStorage['munchkin'])

	save = ->
		data = data.filter (v) -> not v.deleted
		data_k = for v in data
			{name: v.name, gear: v.gear, level: v.level}
		window.localStorage?['munchkin'] = JSON.stringify data_k

	place_index = 1
	addPlayer = (player)->
		del_btn = $('<button>', {class: 'delete'}).text('–')

		name = $ '<input>',
			type: 'text'
			value: player.name
			placeholder: "Player #{place_index++}"
		level = $ '<input>',
			type: 'number'
			value: player.level
			step: 1
			min: 1
			max: 99
		gear = $ '<input>',
			type: 'number'
			value: player.gear
			step: 1
			min: 0
			max: 999
		total = $ '<span>'
		row = $ '<tr>'
		root.append row
		row.append(del_btn, name, level, gear, total)
		row.children().wrap('<td>')

		update = ->
			player.name = name.val()
			player.level = +level.val()
			player.gear = +gear.val()
			total.text(player.level + player.gear)
			save()
			null
		row.find('input[type=number]').spinner()
		row.find('input').change update
		update()

		del_btn.tap (evt)->
			evt.preventDefault()
			player.deleted = true
			row.remove()
			save()
	
	for v in data
		addPlayer v

	add_btn.tap (evt)->
		evt.preventDefault()
		i = data.push({name: null, level: 1, gear: 0}) - 1
		addPlayer data[i]

	reset_btn.tap (evt)->
		data = for v in data
			{name: v.name, level: 1, gear: 0}
		place_index = 1
		$('tr:not(:first)').remove()
		for v in data
			addPlayer v
