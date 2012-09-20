define(['backbone', 'jquery-safe'], function(Backbone, $)
{
    var Attribute = Backbone.Model.extend({
        urlRoot : null,
        medias : null,

        initialize : function(options)
        {
            _.bindAll(this);
            this.medias = new MediaCollection();
        },

        attributes : function()
        {
            return {
                content : false
            };
        },

        url : function() {
            var args = ['keymedia', 'media', this.id, this.get('version')];
            if (arguments.length > 0) {
                args = ['keymedia'].concat(_.toArray(arguments));
            }
            return args.join('/');
        },

        parse : function(data)
        {
            var entity = {};
            if ('media' in data && data.media) entity = data.media;
            if ('content' in data) entity.content = data.content;
            if ('toScale' in data) entity.toScale = data.toScale;
            return data;
        },

        scale : function(media) {
            $.getJSON(this.url('scaler', [media]), this.onScale);
        },

        onScale : function(response) {
            this.trigger('scale', response);
        },

        // Create a new vanity url for a version
        // name should be a string to put on the back of the object name
        // coords should be an array [x,y,x2,y2]
        // size shoudl be an array [width,height]
        addVanityUrl : function(name, coords, size, options)
        {
            options = (options || {});
            var data = {
                name : name,
                size : size
            };

            if (coords)
                data.coords = coords;

            if (_(options).has('media')) {
                data.mediaId = options.media.id;
                data.keymediaId = options.media.get('keymediaId');
            }

            var url = ['keymedia', 'saveVersion', this.get('id'), this.version()].join('::'),
                context = this;
            $.ez(url, data, function(response)
                {
                    context.trigger('version.create', response.content);
                });
        }
    });


    var Media = Backbone.Model.extend({
        urlRoot : '',

        defaults : function() {
            return {
                id : '',
                host : '',
                type : ''
            };
        },

        initialize : function(options)
        {
            options = (options || {});
            _.bindAll(this);
            _.extend(this, _.pick(options, ['urlRoot']));
        },

        domain : function()
        {
            return 'http://' + this.get('host');
        },

        url : function(method)
        {
            return '/' + ['keymedia', 'media', this.id].join('/');
        },

        saveAttr : function()
        {
            // Attribute instance
            var url = this.attr.url('tag', [this.attr.id, this.attr.get('version')]);
            var context = this, data = this.attributes;

            $.ajax({
                url : url,
                data : data,
                dataType : 'json',
                type : 'POST',
                success : function(response) {
                    context.set(response.content);
                }
            });
        },

        addTag : function(tag) {
            var tags = this.get('tags');
            tags.push(tag);
            this.set({tags : _.uniq(tags)}, {silent:true});
            return this;
        },

        removeTag : function(rmTag) {
            var tags = _(this.get('tags')).filter(function(tag) {
                return tag !== rmTag;
            });
            this.set({tags : tags}, {silent:true});
            return this;
        },

        // Generate thumb url for a given size
        thumb : function(width, height, filetype) {
            filetype = (filetype || 'jpg');
            return this.domain() + '/' + width + 'x' + height + '/' + this.id + '.' + filetype;
        }
    });

    var MediaCollection = Backbone.Collection.extend({
        model : Media,

        // Must end in trailing slash
        urlRoot : '/',

        attr : null,

        total : 0,

        q : '',

        limit : 25,

        keymediaId : null,

        initialize : function(options)
        {
            _.bindAll(this);
            return this;
        },

        url : function()
        {
            return ['keymedia', 'browse', this.id, this.version].join('/');
        },

        search : function(q, data)
        {
            var data = (data || {});
            if (typeof q === 'string') {
                this.q = q;
                data.q = q;
            }
            data.limit = this.limit;
            return this.fetch({data : data});
        },

        parse : function(data)
        {
            if ('keymediaId' in data) {
                this.keymediaId = data.keymediaId;
            }
            if ('results' in data) {
                this.total = data.results.total;
                data = data.results.hits;
            }
            return data;
        },

        page : function(q)
        {
            if (this.length < this.total) {
                var data = {
                    limit : this.limit,
                    offset : this.length,
                    q : this.q
                };

                return this.fetch({data: data, add: true});
            }
            return false;
        }
    });

    return {
        media : Media,
        attribute : Attribute,
        collection : MediaCollection
    };
});