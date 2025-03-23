class Api::UsersController < ApplicationController
  before_action :authenticate_user!, except: [:index, :show]
  skip_before_action :verify_authenticity_token

  def current
    Rails.logger.debug("Current user: #{current_user.inspect}") # Log current user for debugging
    if current_user
      Rails.logger.debug("Current user: #{current_user.inspect}") # Log current user for debugging
      render json: current_user
    else
      render json: { error: 'User not authenticated' }, status: :unauthorized
    end
  end

  def relationships
    user = User.find(params[:id])
    followers = user.followers
    following = user.following
    render json: { followers: followers, following: following }, status: :ok
  end


  def show
    Rails.logger.debug("Params ID for user lookup: #{params[:id]}") # Log params ID for debugging
    @user = User.find_by(id: params[:id]) # Use find_by to avoid exceptions
    if @user
      Rails.logger.debug("Response for user ID #{params[:id]}: #{@user.to_json}")
    render json: @user.as_json.merge({
      followers_count: @user.followers.count,
      following_count: @user.following.count
    })
    else
      Rails.logger.error("User not found for ID: #{params[:id]}") # Log error
      render json: { error: "User not found" }, status: :not_found
    end
  end

  def update
    @user = User.find(params[:id])
    if @user.update(user_params)
      render json: @user
    else
      render json: { error: "НЕТ ЗАПИСЕЙ"}
    end
  end

  def destroy
    if params[:id].present?
      @user = User.find(params[:id])
      @user.destroy
      render json: { message: "Пользователь удалён" }, status: :ok
    else
      render json: { error: "Не указан идентификатор пользователя" }, status: :bad_request
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Пользователь не найден" }, status: :not_found
  end

  def follow
    @user = User.find(params[:id])
    Rails.logger.debug("Current user: #{current_user.inspect}") # Log current user for debugging
    if current_user && !current_user.following.include?(@user) && current_user.follow(@user)
      render json: { message: "Вы подписались на пользователя" }, status: :ok
    else
      render json: { error: "Ошибка подписки" }, status: :bad_request
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Пользователь не найден" }, status: :not_found
  end

  def followers
    @user = User.find(params[:id])
    followers = @user.followers
    render json: followers, status: :ok
  end

  def unfollow
    @user = User.find(params[:id])
    if current_user.unfollow(@user)
      render json: { message: "Вы отписались от пользователя" }, status: :ok
    else
      render json: { error: "Ошибка отписки" }, status: :bad_request
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Пользователь не найден" }, status: :not_found
  end

  def index
    @users = User.all
    render json: @users
  end

  def search
    @q = User.ransack(nickname_cont: params[:q])
    @users = @q.result(distinct: true)
    render json: @users
  end

  private
  def user_params
    params.require(:user).permit(:name, :email, :photo, :nickname, :description, :gender)
  end
end
