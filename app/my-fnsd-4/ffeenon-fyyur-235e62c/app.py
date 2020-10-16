#----------------------------------------------------------------------------#
from config import SQLALCHEMY_DATABASE_URI
from flask_migrate import Migrate
import sys, datetime
import json
import dateutil.parser
import babel
from flask import Flask, render_template, request, Response, flash, redirect, url_for
from flask_moment import Moment
from flask_sqlalchemy import SQLAlchemy
import logging
from logging import Formatter, FileHandler
from flask_wtf import Form
from forms import *
#----------------------------------------------------------------------------#
# App Config.
#----------------------------------------------------------------------------#

app = Flask(__name__)
moment = Moment(app)
app.config.from_object('config')
db = SQLAlchemy(app)

app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI

migrate = Migrate(app, db)

from models import *
#----------------------------------------------------------------------------#
# Filters.
#----------------------------------------------------------------------------#

def format_datetime(value, format='medium'):
  date = dateutil.parser.parse(value)
  if format == 'full':
      format="EEEE MMMM, d, y 'at' h:mma"
  elif format == 'medium':
      format="EE MM, dd, y h:mma"
  return babel.dates.format_datetime(date, format)

app.jinja_env.filters['datetime'] = format_datetime

#----------------------------------------------------------------------------#
# Controllers.
#----------------------------------------------------------------------------#

@app.route('/')
def index():
  return render_template('pages/home.html')

#  Venues
#  ----------------------------------------------------------------

@app.route('/venues')
def venues():
  data = []
  data_dict = {}

  venues = Venue.query.all()
  for venue in venues:
    key = '{}|{}'.format(venue.city, venue.state)
    if key not in data_dict:
      data_dict[key] = {
          'city':venue.city,
          'state':venue.state,
          'venues':[]
        }

    data_dict[key]['venues'].append({
        'id':venue.id,
        'name':venue.name,
        'num_upcoming_shows':len(list(filter(lambda x: x.start_time > datetime.now(), venue.children_shows)))
      })

  for key in data_dict:
    data.append(data_dict[key])

  return render_template('pages/venues.html', areas=data);

@app.route('/venues/search', methods=['POST'])
def search_venues():
  term = request.form.get('search_term', '')

  response = {
    "count":0,
    "data":[]
  }
  for item in Venue.query.filter(Venue.name.ilike('%{}%'.format(term))).all():
    d = {}
    d['id'] = item.id
    d['name'] = item.name
    d['num_upcoming_shows'] = len(list(filter(lambda x: x.start_time>datetime.now(), item.children_shows)))
    response['data'].append(d)
    response['count'] += 1

  return render_template('pages/search_venues.html', results=response, search_term=request.form.get('search_term', ''))

@app.route('/venues/<int:venue_id>')
def show_venue(venue_id):
  item = db.session.query(Venue).filter(Venue.id==venue_id).first()

  venue = {}
  venue['id'] = item.id
  venue['name'] = item.name
  venue['genres'] = item.genres.split(',')
  venue['address'] = item.address
  venue['city'] = item.city
  venue['state'] = item.state
  venue['phone'] = item.phone
  venue['website'] = item.website
  venue['facebook_link'] = item.facebook_link
  venue['seeking_talent'] = item.seeking_talent
  venue['seeking_description'] = item.seeking_description
  venue['image_link'] = item.image_link

  past_shows = []
  upcoming_shows = []
  past_shows_count = 0
  upcoming_shows_count = 0

  for show in item.children_shows:
    show_data = {}
    
    show_data['artist_id'] = show.parent_artist.id
    show_data['artist_name'] = show.parent_artist.name
    show_data['artist_image_link'] = show.parent_artist.image_link
    show_data['start_time'] = str(show.start_time)

      
    if show.start_time > datetime.now():
      upcoming_shows.append(show_data)
      upcoming_shows_count += 1
    else:
      past_shows.append(show_data)
      past_shows_count += 1

  venue['past_shows'] = past_shows
  venue['upcoming_shows'] = upcoming_shows
  venue['upcoming_shows_count'] = upcoming_shows_count
  venue['past_shows_count'] = past_shows_count

  return render_template('pages/show_venue.html', venue=venue)

#  Create Venue
#  ----------------------------------------------------------------

@app.route('/venues/create', methods=['GET'])
def create_venue_form():
  form = VenueForm()
  return render_template('forms/new_venue.html', form=form)

@app.route('/venues/create', methods=['POST'])
def create_venue_submission():
  try:
    form = request.form
    venue = Venue(
      name = form.get('name', ''),
      city = form.get('city', ''),
      state = form.get('state', ''),
      address = form.get('address', ''),
      phone = form.get('phone', ''),
      image_link = form.get('image_link', ''),
      facebook_link = form.get('facebook_link', ''),
      website = form.get('website', ''),
      genres = ','.join(form.getlist('genres'))
    )
    db.session.add(venue)
    db.session.commit()
    flash('Venue ' + request.form['name'] + ' was successfully listed!')
  except:
    db.session.rollback()
    flash('An error occurred. Venue ' + request.form['name'] + ' could not be listed.')
    print(sys.exc_info())
  finally:
    db.session.close()
  # see: http://flask.pocoo.org/docs/1.0/patterns/flashing/
  return render_template('pages/home.html')

@app.route('/venues/<venue_id>', methods=['DELETE'])
def delete_venue(venue_id):
  venue = Venue.query.get(venue_id)
  venue_name = venue.name
  try:
    db.session.delete(venue)
    db.session.commit()
    flash('Venue ' + venue_name + ' was successfully delete!')
  except:
    db.session.rollback()
    flash('An error occurred. Venue ' + venue_name + ' could not be delete!')
    print(sys.exc_info())
  finally:
    db.session.close()

  return None

#  Artists
#  ----------------------------------------------------------------
@app.route('/artists')
def artists():
  artists = []

  for item in Artist.query.all():
    artist = {}

    artist['id'] = item.id
    artist['name'] = item.name

    artists.append(artist)

  return render_template('pages/artists.html', artists=artists)

@app.route('/artists/search', methods=['POST'])
def search_artists():
  term = request.form.get('search_term', '')

  response = {
    "count":0,
    "data":[]
  }
  for item in Artist.query.filter(Artist.name.ilike('%{}%'.format(term))).all():
    d = {}
    d['id'] = item.id
    d['name'] = item.name
    d['num_upcoming_shows'] = len(list(filter(lambda x: x.start_time>datetime.now(), item.children_shows)))

    response['data'].append(d)
    response['count'] += 1

  return render_template('pages/search_artists.html', results=response, search_term=request.form.get('search_term', ''))

@app.route('/artists/<int:artist_id>')
def show_artist(artist_id):
  artist = {}

  item = Artist.query.get(artist_id)

  artist['id'] = item.id
  artist['name'] = item.name
  artist['genres'] = item.genres.split(',')
  artist['city'] = item.city
  artist['state'] = item.state
  artist['phone'] = item.phone
  artist['website'] = item.website
  artist['facebook_link'] = item.facebook_link
  artist['seeking_venue'] = item.seeking_venue
  artist['seeking_description'] = item.seeking_description
  artist['image_link'] = item.image_link

  past_shows = []
  upcoming_shows = []
  past_shows_count = 0
  upcoming_shows_count = 0

  for show in item.children_shows:
    show_data = {}
    
    show_data['venue_id'] = show.parent_venue.id
    show_data['venue_name'] = show.parent_venue.name
    show_data['venue_image_link'] = show.parent_venue.image_link
    show_data['start_time'] = str(show.start_time)

      
    if show.start_time > datetime.now():
      upcoming_shows.append(show_data)
      upcoming_shows_count += 1
    else:
      past_shows.append(show_data)
      past_shows_count += 1

  artist['past_shows'] = past_shows
  artist['upcoming_shows'] = upcoming_shows
  artist['upcoming_shows_count'] = upcoming_shows_count
  artist['past_shows_count'] = past_shows_count

  return render_template('pages/show_artist.html', artist=artist)

#  Update
#  ----------------------------------------------------------------
@app.route('/artists/<int:artist_id>/edit', methods=['GET'])
def edit_artist(artist_id):
  form = ArtistForm()
  artist={
    "id": 4,
    "name": "Guns N Petals",
    "genres": ["Rock n Roll"],
    "city": "San Francisco",
    "state": "CA",
    "phone": "326-123-5000",
    "website": "https://www.gunsnpetalsband.com",
    "facebook_link": "https://www.facebook.com/GunsNPetals",
    "seeking_venue": True,
    "seeking_description": "Looking for shows to perform at in the San Francisco Bay Area!",
    "image_link": "https://images.unsplash.com/photo-1549213783-8284d0336c4f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80"
  }
  return render_template('forms/edit_artist.html', form=form, artist=artist)

@app.route('/artists/<int:artist_id>/edit', methods=['POST'])
def edit_artist_submission(artist_id):
  return redirect(url_for('show_artist', artist_id=artist_id))

@app.route('/venues/<int:venue_id>/edit', methods=['GET'])
def edit_venue(venue_id):
  form = VenueForm()
  item = Venue.query.get(venue_id)

  venue = {
    "id": item.id,
    "name": item.name,
    "genres": ",".split(item.genres),
    "address": item.address,
    "city": item.city,
    "state": item.state,
    "phone": item.phone,
    "website": item.website,
    "facebook_link": item.facebook_link,
    "seeking_talent": item.seeking_talent,
    "seeking_description": item.seeking_description,
    "image_link": item.image_link
  }
  return render_template('forms/edit_venue.html', form=form, venue=venue)

@app.route('/venues/<int:venue_id>/edit', methods=['POST'])
def edit_venue_submission(venue_id):
  return redirect(url_for('show_venue', venue_id=venue_id))

#  Create Artist
#  ----------------------------------------------------------------

@app.route('/artists/create', methods=['GET'])
def create_artist_form():
  form = ArtistForm()
  return render_template('forms/new_artist.html', form=form)

@app.route('/artists/create', methods=['POST'])
def create_artist_submission():
  try:
    form = request.form
    artist = Artist(
      name = form.get('name', ''),
      city = form.get('city', ''),
      state = form.get('state', ''),
      phone = form.get('phone', ''),
      image_link = form.get('image_link', ''),
      facebook_link = form.get('facebook_link', ''),
      website = form.get('website', ''),
      genres = ','.join(form.getlist('genres'))
    )
    db.session.add(artist)
    db.session.commit()
    flash('Artist ' + request.form['name'] + ' was successfully listed!')
  except:
    db.session.rollback()
    flash('An error occurred. Artist ' + request.form['name'] + ' could not be listed.')
    print(sys.exc_info())
  finally:
    db.session.close()

  return render_template('pages/home.html')


#  Shows
#  ----------------------------------------------------------------

@app.route('/shows')
def shows():
  shows = []

  for item in Show.query.all():
    show = {}

    show['venue_id'] = item.parent_venue.id
    show['venue_name'] = item.parent_venue.name
    show['artist_id'] = item.parent_artist.id
    show['artist_name'] = item.parent_artist.name
    show['artist_image_link'] = item.parent_artist.image_link
    show['start_time'] = str(item.start_time)

    shows.append(show)

  return render_template('pages/shows.html', shows=shows)

@app.route('/shows/create')
def create_shows():
  # renders form. do not touch.
  form = ShowForm()
  return render_template('forms/new_show.html', form=form)

@app.route('/shows/create', methods=['POST'])
def create_show_submission():
  print(request.form)
  try:
    form = request.form
    show = Show(
      artist_id = form.get('artist_id', ''),
      venue_id = form.get('venue_id', ''),
      start_time = form.get('start_time', '')
    )
    db.session.add(show)
    db.session.commit()
    flash('Show was successfully listed!')
  except:
    db.session.rollback()
    flash('An error occurred. Show could not be listed.')
    print(sys.exc_info())
  finally:
    db.session.close()

  return render_template('pages/home.html')

@app.errorhandler(404)
def not_found_error(error):
    return render_template('errors/404.html'), 404

@app.errorhandler(500)
def server_error(error):
    return render_template('errors/500.html'), 500


if not app.debug:
    file_handler = FileHandler('error.log')
    file_handler.setFormatter(
        Formatter('%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]')
    )
    app.logger.setLevel(logging.INFO)
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    app.logger.info('errors')

#----------------------------------------------------------------------------#
# Launch.
#----------------------------------------------------------------------------#

# Default port:
if __name__ == '__main__':
    app.run()

# Or specify port manually:
'''
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
'''
